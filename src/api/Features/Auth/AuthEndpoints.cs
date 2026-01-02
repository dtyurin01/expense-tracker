using System.Text;
using Api.Contracts;
using Api.Infrastructure.Email;
using Api.Infrastucture.Security;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace Api.Features.Auth;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/auth");

        g.MapPost(
            "/register",
            async (UserManager<ApplicationUser> users, RegisterDto dto) =>
            {
                var user = new ApplicationUser
                {
                    UserName = dto.Email,
                    Email = dto.Email,
                    FullName = dto.FullName,
                };
                var result = await users.CreateAsync(user, dto.Password);
                return result.Succeeded ? Results.NoContent() : Results.BadRequest(result.Errors);
            }
        );

        g.MapPost(
                "/login",
                async (
                    LoginDto dto,
                    UserManager<ApplicationUser> users,
                    SignInManager<ApplicationUser> signIn,
                    JwtTokenService tokens,
                    IRefreshTokenService refreshTokens,
                    HttpContext ctx,
                    HttpResponse http,
                    IWebHostEnvironment env,
                    IOptionsSnapshot<JwtOptions> opt
                ) =>
                {
                    var user = await users.FindByEmailAsync(dto.Email);

                    if (user is null)
                    {
                        if (env.IsDevelopment())
                        {
                            return Results.BadRequest(
                                $"[DEBUG] User with email '{dto.Email}' not found."
                            );
                        }

                        return Results.BadRequest("Invalid credentials");
                    }

                    var ok = await signIn.CheckPasswordSignInAsync(
                        user,
                        dto.Password,
                        lockoutOnFailure: false
                    );

                    if (!ok.Succeeded)
                    {
                        if (env.IsDevelopment())
                        {
                            if (ok.IsLockedOut)
                                return Results.BadRequest(
                                    "[DEBUG] Account is locked out (Too many attempts)."
                                );

                            if (ok.IsNotAllowed)
                                return Results.BadRequest(
                                    "[DEBUG] Account is not allowed (Check EmailConfirmed column in DB)."
                                );

                            if (ok.RequiresTwoFactor)
                                return Results.BadRequest("[DEBUG] 2FA required.");

                            return Results.BadRequest(
                                $"[DEBUG] Invalid password. Input was: '{dto.Password}'"
                            );
                        }

                        return Results.BadRequest("Invalid credentials");
                    }

                    // access
                    var access = await AuthHelpers.CreateAccessForLoginAsync(tokens, users, user);

                    // refresh
                    var (ip, ua) = AuthHelpers.GetClientInfo(ctx);
                    var (rawRefresh, _) = await refreshTokens.IssueAsync(user.Id, ip, ua);

                    var jwt = opt.Value;
                    AuthHelpers.SetAuthCookies(http, env, access, rawRefresh, jwt);

                    return Results.Ok(AuthHelpers.AccessPayload(access, jwt));
                }
            )
            .AllowAnonymous();

        g.MapPost(
                "/refresh",
                async (
                    HttpRequest req,
                    HttpResponse http,
                    IWebHostEnvironment env,
                    IRefreshTokenService refreshTokens,
                    UserManager<ApplicationUser> users,
                    JwtTokenService tokens,
                    IOptionsSnapshot<JwtOptions> opt
                ) =>
                {
                    var raw = req.Cookies[AuthHelpers.CookieNames.Refresh];
                    if (string.IsNullOrEmpty(raw))
                        return Results.Unauthorized();

                    var (ip, ua) = AuthHelpers.GetClientInfo(req.HttpContext);

                    try
                    {
                        var (rawNew, saved) = await refreshTokens.RevokeAsync(raw, ip, ua);

                        var user = await users.FindByIdAsync(saved.UserId.ToString());
                        if (user is null)
                        {
                            return Results.Unauthorized();
                        }

                        await users.UpdateSecurityStampAsync(user);

                        var access = await AuthHelpers.CreateAccessForRefreshAsync(
                            tokens,
                            users,
                            user
                        );

                        var jwt = opt.Value;
                        AuthHelpers.SetAuthCookies(http, env, access, rawNew, jwt);

                        return Results.Ok(AuthHelpers.AccessPayload(access, jwt));
                    }
                    catch (SecurityException)
                    {
                        AuthHelpers.ClearRefreshCookie(http);
                        return Results.Unauthorized();
                    }
                }
            )
            .AllowAnonymous();

        g.MapPost(
            "/forgot-password",
            async (
                [FromBody] ForgotPasswordRequest request,
                UserManager<ApplicationUser> userManager,
                IEmailService emailService,
                IWebHostEnvironment env
            ) =>
            {
                var user = await userManager.FindByEmailAsync(request.Email);

                if (user is null)
                {
                    return Results.Ok(
                        new { message = "If the email exists, a link has been sent." }
                    );
                }

                var token = await userManager.GeneratePasswordResetTokenAsync(user);

                var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var resetLink =
                    $"http://localhost:3000/reset-password?token={encodedToken}&email={request.Email}";

                var message =
                    $@"
                    <h1>Reset Password</h1>
                    <p>Someone requested a password reset for your account.</p>
                    <p>Click the link below to set a new password:</p>
                    <a href='{resetLink}'>Reset Password</a>
                    <br/> 
                    <p>If you didn't ask for this, just ignore this email.</p>";

                await emailService.SendEmailAsync(request.Email, "Reset Password Request", message);

                if (env.IsDevelopment())
                {
                    return Results.Ok(
                        new { message = "Verification link sent", debugToken = encodedToken }
                    );
                }
                else
                {
                    return Results.Ok(new { message = "Verification link sent" });
                }
            }
        );

        g.MapPost(
            "/reset-password",
            async (
                [FromBody] ResetPasswordRequest request,
                UserManager<ApplicationUser> userManager,
                Data.AppDbContext dbContext
            ) =>
            {
                var user = await userManager.FindByEmailAsync(request.Email);

                if (user is null)
                {
                    return Results.BadRequest("Invalid Request");
                }

                string decodedToken;
                try
                {
                    var decodedBytes = WebEncoders.Base64UrlDecode(request.Token);
                    decodedToken = Encoding.UTF8.GetString(decodedBytes);
                }
                catch
                {
                    return Results.BadRequest("Invalid token");
                }

                var result = await userManager.ResetPasswordAsync(
                    user,
                    decodedToken,
                    request.NewPassword
                );

                if (!result.Succeeded)
                {
                    return Results.BadRequest(result.Errors);
                }

                await dbContext.SaveChangesAsync();

                return Results.Ok(new { message = "Password has been reset successfully." });
            }
        );

        g.MapPost(
                "/logout",
                async (
                    UserManager<ApplicationUser> users,
                    HttpContext httpCtx,
                    HttpResponse http,
                    IRefreshTokenService refreshTokens
                ) =>
                {
                    var me = await users.GetUserAsync(httpCtx.User);
                    if (me is not null)
                    {
                        await users.UpdateSecurityStampAsync(me); // invalid access
                        await refreshTokens.RevokeAllAsync(
                            me.Id,
                            httpCtx.Connection.RemoteIpAddress?.ToString()
                        );
                    }

                    http.Cookies.Delete(
                        AuthHelpers.CookieNames.Auth,
                        new CookieOptions { Path = "/" }
                    );
                    AuthHelpers.ClearRefreshCookie(http);
                    return Results.NoContent();
                }
            )
            .RequireAuthorization();

        return app;
    }
}
