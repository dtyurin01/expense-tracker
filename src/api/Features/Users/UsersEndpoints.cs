using System.Security.Claims;
using Api.Contracts;
using Api.Models;
using Microsoft.AspNetCore.Identity;

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
                    HttpRequest request
                ) =>
                {
                    if (file is null || file.Length == 0)
                    {
                        return Results.BadRequest("No file uploaded.");
                    }

                    if (file.Length > 5 * 1024 * 1024)
                    {
                        return Results.BadRequest("File size exceeds 5MB.");
                    }

                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

                    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

                    if (!allowedExtensions.Contains(ext))
                    {
                        return Results.BadRequest("Invalid file type.");
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

                    var fileName = $"{userId}_{Guid.NewGuid()}{ext}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    if (!string.IsNullOrEmpty(user.AvatarUrl))
                    {
                        var oldFileName = Path.GetFileName(user.AvatarUrl);
                        var oldFilePath = Path.Combine(uploadsFolder, oldFileName);
                        if (File.Exists(oldFilePath))
                        {
                            File.Delete(oldFilePath);
                        }
                    }

                    var baseUrl = $"{request.Scheme}://{request.Host}";
                    if (request.PathBase.HasValue)
                    {
                        baseUrl += request.PathBase.Value;
                    }

                    var fullUrl = $"{baseUrl}/uploads/{fileName}";

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
                            user.UserName!,
                            user.AvatarUrl,
                            user.Currency ?? "EUR",
                            roles
                        )
                    );
                }
            )
            .RequireAuthorization("AdminOnly");
    }
}
