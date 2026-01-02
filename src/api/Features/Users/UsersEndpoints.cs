using System.Security.Claims;
using Api.Contracts;
using Api.Infrastructure.Email;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;

namespace Api.Features.Users;

public static class UsersEndpoints
{
    public static void MapUsersEndpoints(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/users").RequireAuthorization();

        g.MapGet(
            "/me",
            async (ClaimsPrincipal userPrincipal, UserManager<ApplicationUser> userManager) =>
            {
                var userId = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await userManager.FindByIdAsync(userId!);

                if (user is null)
                {
                    return Results.Unauthorized();
                }

                var roles = await userManager.GetRolesAsync(user);

                return Results.Ok(
                    new UserProfileDto(
                        user.Id,
                        user.Email!,
                        user.UserName!,
                        user.FullName!,
                        user.AvatarUrl,
                        user.Currency ?? "EUR",
                        roles
                    )
                );
            }
        );

        g.MapPost(
                "/avatar",
                async (
                    IFormFile file,
                    ClaimsPrincipal userPrincipal,
                    UserManager<ApplicationUser> userManager,
                    IWebHostEnvironment env,
                    HttpRequest request,
                    ILogger<Program> logger
                ) =>
                {
                    if (file is null || file.Length == 0)
                    {
                        return Results.BadRequest("No file uploaded. Please try again");
                    }

                    if (file.Length > 5 * 1024 * 1024)
                    {
                        return Results.BadRequest("File size exceeds 5MB.");
                    }

                    try
                    {
                        using var stream = file.OpenReadStream();

                        var format = await Image.DetectFormatAsync(stream);

                        if (format == null)
                        {
                            return Results.BadRequest(
                                "Invalid image format. Please upload a valid image."
                            );
                        }

                        var allowedMimeTypes = new[] { "image/jpeg", "image/png", "image/webp" };
                        if (!allowedMimeTypes.Contains(format.DefaultMimeType))
                        {
                            return Results.BadRequest(
                                $"Format {format.Name} is not supported. Use JPG, PNG or WebP."
                            );
                        }
                    }
                    catch
                    {
                        return Results.BadRequest("File is not a valid image or is corrupted.");
                    }

                    var userId = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
                    var user = await userManager.FindByIdAsync(userId!);
                    if (user is null)
                    {
                        return Results.Unauthorized();
                    }

                    var uploadsFolder = Path.Combine(env.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var userFolder = Path.Combine(uploadsFolder, userId!);

                    if (!Directory.Exists(userFolder))
                    {
                        Directory.CreateDirectory(userFolder);
                    }

                    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                    var fileName = $"{Guid.NewGuid()}{ext}";
                    var filePath = Path.Combine(userFolder, fileName);

                    using var fileStream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(fileStream);

                    if (!string.IsNullOrEmpty(user.AvatarUrl))
                    {
                        try
                        {
                            var uri = new Uri(user.AvatarUrl);
                            var oldFileName = Path.GetFileName(uri.LocalPath);
                            var oldFilePath = Path.Combine(userFolder, oldFileName);
                            if (File.Exists(oldFilePath))
                            {
                                File.Delete(oldFilePath);
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.LogWarning(
                                ex,
                                "Failed to delete old avatar for user {UserId}",
                                userId
                            );
                        }
                    }

                    var baseUrl = $"{request.Scheme}://{request.Host}";
                    if (request.PathBase.HasValue)
                    {
                        baseUrl += request.PathBase.Value;
                    }

                    var fullUrl = $"{baseUrl}/uploads/{userId}/{fileName}";

                    user.AvatarUrl = fullUrl;
                    await userManager.UpdateAsync(user);

                    return Results.Ok(new { avatarUrl = fullUrl });
                }
            )
            .DisableAntiforgery();

        g.MapGet(
                "/{id:guid}",
                async (Guid id, UserManager<ApplicationUser> users) =>
                {
                    var user = await users.FindByIdAsync(id.ToString());
                    if (user is null)
                    {
                        return Results.NotFound();
                    }

                    var roles = await users.GetRolesAsync(user);

                    return Results.Ok(
                        new UserProfileDto(
                            user.Id,
                            user.Email!,
                            user.FullName!,
                            user.UserName!,
                            user.AvatarUrl,
                            user.Currency ?? "EUR",
                            roles
                        )
                    );
                }
            )
            .RequireAuthorization("AdminOnly");

        g.MapPatch(
            "/change-nickname",
            async (
                [FromBody] UpdateProfileRequest request,
                ClaimsPrincipal userPrincipal,
                UserManager<ApplicationUser> userManager
            ) =>
            {
                var userId = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await userManager.FindByIdAsync(userId!);
                if (user is null)
                {
                    return Results.Unauthorized();
                }

                user.FullName = request.Nickname;

                var result = await userManager.UpdateAsync(user);

                return result.Succeeded ? Results.Ok() : Results.BadRequest(result.Errors);
            }
        );
        g.MapPost(
            "/change-email/start",
            async (
                [FromBody] StartEmailChangeRequest request,
                ClaimsPrincipal userPrincipal,
                UserManager<ApplicationUser> userManager,
                IEmailService emailService
            ) =>
            {
                var userId = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await userManager.FindByIdAsync(userId!);
                if (user is null)
                {
                    return Results.Unauthorized();
                }
                var isPasswordCorrect = await userManager.CheckPasswordAsync(
                    user,
                    request.CurrentPassword
                );

                if (!isPasswordCorrect)
                {
                    return Results.BadRequest("Current password is incorrect.");
                }

                var emailOwner = await userManager.FindByEmailAsync(request.NewEmail);

                if (emailOwner is not null)
                {
                    return Results.BadRequest("Email is already in use.");
                }

                var token = await userManager.GenerateChangeEmailTokenAsync(user, request.NewEmail);

                // in real project
                var link =
                    $"http://localhost:3000/settings?emailChangeToken={token}&newEmail={request.NewEmail}";
                await emailService.SendEmailAsync(
                    request.NewEmail,
                    "Confirm Email Change",
                    $"Click here: {link}"
                );

                return Results.Ok(new { message = "Verification link sent", debugToken = token });
            }
        );
        g.MapPost(
            "/change-email/confirm",
            async (
                [FromBody] ConfirmEmailChangeRequest request,
                ClaimsPrincipal userPrincipal,
                UserManager<ApplicationUser> userManager
            ) =>
            {
                var userId = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await userManager.FindByIdAsync(userId!);
                if (user is null)
                {
                    return Results.Unauthorized();
                }
                var result = await userManager.ChangeEmailAsync(
                    user,
                    request.NewEmail,
                    request.Token
                );

                if (!result.Succeeded)
                {
                    return Results.BadRequest("Email change failed. Token may be invalid.");
                }

                await userManager.SetUserNameAsync(user, request.NewEmail);

                return Results.Ok();
            }
        );
    }
}
