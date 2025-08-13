using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Identity;

namespace Api.Extensions;

public static class IdentityExtensions
{
    public static IServiceCollection AddIdentityAndCookies(this IServiceCollection services)
    {
        services
            .AddIdentity<ApplicationUser, ApplicationRole>(o =>
            {
                o.Password.RequiredLength = 8;
                o.Password.RequireNonAlphanumeric = false;
                o.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        services.ConfigureApplicationCookie(o =>
        {
            o.Cookie.Name = "app.auth";
            o.Cookie.HttpOnly = true;
            o.Cookie.SameSite = SameSiteMode.Lax;           
            o.Cookie.SecurePolicy = CookieSecurePolicy.None; 
            o.Events.OnRedirectToLogin = ctx => { ctx.Response.StatusCode = 401; return Task.CompletedTask; };
            o.Events.OnRedirectToAccessDenied = ctx => { ctx.Response.StatusCode = 403; return Task.CompletedTask; };
        });

        services.AddAuthorization();
        return services;
    }
}
