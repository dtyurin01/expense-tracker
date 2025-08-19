using System.Text;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Api.Infrastucture.Security;

namespace Api.Extensions;

public static class IdentityExtensions
{
    public static IServiceCollection AddIdentityAndJwt(this IServiceCollection services, IConfiguration cfg)
    {
        services
            .AddIdentity<ApplicationUser, ApplicationRole>(o =>
            {
                o.Password.RequiredLength = 8;
                o.Password.RequireNonAlphanumeric = false;
                o.User.RequireUniqueEmail = true;
            })
            .AddRoles<ApplicationRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders();

        var issuer = cfg["Jwt:Issuer"];
        var audience = cfg["Jwt:Audience"];
        var keyStr = cfg["Jwt:Key"];

        if(string.IsNullOrWhiteSpace(keyStr))
            throw new InvalidOperationException("Missing Jwt:Key (set JWT__KEY env variable).");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                o.IncludeErrorDetails = true;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                o.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        if (!string.IsNullOrEmpty(ctx.Token))
                            return Task.CompletedTask;

                        var token = ctx.Request.Cookies["pp_auth"];
                        if (!string.IsNullOrEmpty(token))
                            ctx.Token = token;

                        return Task.CompletedTask; 
                    },

                    OnTokenValidated = async ctx =>
                    {
                        var um = ctx.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();

                        var principal = ctx.Principal;
                        if (principal is null)
                        {
                            ctx.Fail("No principal");
                            return;
                        }

                        var userId = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                                     ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

                        if (string.IsNullOrWhiteSpace(userId))
                        {
                            ctx.Fail("Missing user id");
                            return;
                        }

                        var user = await um.FindByIdAsync(userId);
                        if (user is null)
                        {
                            ctx.Fail("User not found");
                            return;
                        }

                        var tokenStamp = principal.FindFirstValue("ss");
                        if (string.IsNullOrEmpty(tokenStamp))
                        {
                            ctx.Fail("Missing security stamp");
                            return;
                        }

                        var currentStamp = await um.GetSecurityStampAsync(user);
                        if (!string.Equals(tokenStamp, currentStamp, StringComparison.Ordinal))
                        {
                            ctx.Fail("Token invalidated");
                            return;
                        }
                    }
                };
            });

        services.AddAuthorization();

        services.AddScoped<JwtTokenService>();

        services.AddScoped<Features.Auth.IRefreshTokenService, RefreshTokenService>();

        services.ConfigureApplicationCookie(opt =>
        {
            opt.Events.OnRedirectToLogin = c => { c.Response.StatusCode = 401; return Task.CompletedTask; };
            opt.Events.OnRedirectToAccessDenied = c => { c.Response.StatusCode = 403; return Task.CompletedTask; };
        });

        return services;
    }
}
