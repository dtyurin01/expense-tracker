using Api.Contracts;
using Api.Infrastucture.Security;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Api.Features.Auth;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/auth");

        g.MapPost("/register", async (UserManager<ApplicationUser> users, RegisterDto dto) =>
        {
            var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email, FullName = dto.FullName };
            var result = await users.CreateAsync(user, dto.Password);
            return result.Succeeded ? Results.NoContent() : Results.BadRequest(result.Errors);
        });

        g.MapGet("/me", async (UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            if (me is null) return Results.Unauthorized();
            var roles = await users.GetRolesAsync(me);
            return Results.Ok(new { me.Id, me.UserName, me.Email, me.FullName, roles });
        }).RequireAuthorization();

        g.MapPost("/login", async (
                LoginDto dto,
                UserManager<ApplicationUser> users,
                SignInManager<ApplicationUser> signIn,
                JwtTokenService tokens,
                IRefreshTokenService refreshTokens,
                HttpContext ctx,
                HttpResponse http,
                IWebHostEnvironment env,
                IOptionsSnapshot<JwtOptions> opt) =>
        {
            var user = await users.FindByEmailAsync(dto.Email);
            if (user is null) return Results.BadRequest("Invalid credentials");

            var ok = await signIn.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: false);
            if (!ok.Succeeded) return Results.BadRequest("Invalid credentials");

            // access
            var access = await AuthHelpers.CreateAccessForLoginAsync(tokens, users, user);

            // refresh
            var (ip, ua) = AuthHelpers.GetClientInfo(ctx);
            var (rawRefresh, _) = await refreshTokens.IssueAsync(user.Id, ip, ua);

            var jwt = opt.Value;
            AuthHelpers.SetAuthCookies(http, env, access, rawRefresh, jwt);

            return Results.Ok(AuthHelpers.AccessPayload(access, jwt));
        })
        .AllowAnonymous();

        g.MapPost("/refresh", async (
            HttpRequest req,
            HttpResponse http,
            IWebHostEnvironment env,
            IRefreshTokenService refreshTokens,
            UserManager<ApplicationUser> users,
            JwtTokenService tokens,
            IOptionsSnapshot<JwtOptions> opt) =>
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

                var access = await AuthHelpers.CreateAccessForRefreshAsync(tokens, users, user);

                var jwt = opt.Value;
                AuthHelpers.SetAuthCookies(http, env, access, rawNew, jwt);

                return Results.Ok(AuthHelpers.AccessPayload(access, jwt));
            }
            catch (SecurityException)
            {
                AuthHelpers.ClearRefreshCookie(http);
                return Results.Unauthorized();
            }
        })
        .AllowAnonymous();

        g.MapPost("/logout", async (
            UserManager<ApplicationUser> users,
            HttpContext httpCtx,
            HttpResponse http,
            IRefreshTokenService refreshTokens) =>
        {
            var me = await users.GetUserAsync(httpCtx.User);
            if (me is not null)
            {
                await users.UpdateSecurityStampAsync(me); // invalid access
                await refreshTokens.RevokeAllAsync(me.Id, httpCtx.Connection.RemoteIpAddress?.ToString());
            }

            http.Cookies.Delete(AuthHelpers.CookieNames.Auth, new CookieOptions { Path = "/" });
            AuthHelpers.ClearRefreshCookie(http);
            return Results.NoContent();
        })
        .RequireAuthorization();

        return app;
    }
}
