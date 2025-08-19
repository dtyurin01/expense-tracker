using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Api.Features.Auth;

internal static class AuthHelpers
{
    internal static class CookieNames
    {
        public const string Auth = "pp_auth";
        public const string Refresh = "pp_refresh";
    }

    public static (string? ip, string? ua) GetClientInfo(HttpContext ctx)
    {
        var ip = ctx.Connection.RemoteIpAddress?.ToString();
        var ua = ctx.Request.Headers.UserAgent.ToString();
        return (ip, ua);
    }

    public static void SetAuthCookies(
        HttpResponse http,
        IWebHostEnvironment env,
        string access,
        string refresh,
        JwtOptions jwt)
    {
        http.Cookies.Append(CookieNames.Auth, access, new CookieOptions
        {
            HttpOnly = true,
            Secure = !env.IsDevelopment(),
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddMinutes(jwt.ExpireMinutes)
        });

        http.Cookies.Append(CookieNames.Refresh, refresh, new CookieOptions
        {
            HttpOnly = true,
            Secure = !env.IsDevelopment(),
            SameSite = SameSiteMode.Strict,
            Path = "/auth/refresh",
            Expires = DateTimeOffset.UtcNow.AddDays(jwt.RefreshExpireDays)
        });
    }

    public static void ClearRefreshCookie(HttpResponse http)
    {
        http.Cookies.Delete(CookieNames.Refresh, new CookieOptions { Path = "/auth/refresh" });
    }


    public static async Task<string> CreateAccessForLoginAsync(
        JwtTokenService tokens,
        UserManager<ApplicationUser> users,
        ApplicationUser user)
    {
        await users.UpdateSecurityStampAsync(user);
        var stamp = await users.GetSecurityStampAsync(user);
        var roles = await users.GetRolesAsync(user);
        return tokens.Create(user, roles, stamp);
    }

    public static async Task<string> CreateAccessForRefreshAsync(
        JwtTokenService tokens,
        UserManager<ApplicationUser> users,
        ApplicationUser user)
    {
        var stamp = await users.GetSecurityStampAsync(user);
        var roles = await users.GetRolesAsync(user);
        return tokens.Create(user, roles, stamp);
    }

    public static object AccessPayload(string access, JwtOptions jwt)
        => new { access_token = access, expires_in = jwt.ExpireMinutes * 60 };
}
