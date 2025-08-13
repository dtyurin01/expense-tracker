using Api.Contracts;
using Api.Models;
using Microsoft.AspNetCore.Identity;

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

        g.MapPost("/login", async (SignInManager<ApplicationUser> signIn, UserManager<ApplicationUser> users, LoginDto dto) =>
        {
            var user = await users.FindByEmailAsync(dto.Email);
            if (user is null) return Results.Unauthorized();
            var res = await signIn.PasswordSignInAsync(user, dto.Password, isPersistent: true, lockoutOnFailure: false);
            return res.Succeeded ? Results.NoContent() : Results.Unauthorized();
        });

        g.MapPost("/logout", async (SignInManager<ApplicationUser> signIn) =>
        {
            await signIn.SignOutAsync();
            return Results.NoContent();
        });

        g.MapGet("/me", async (UserManager<ApplicationUser> users, HttpContext http) =>
        {
            if (http.User?.Identity?.IsAuthenticated != true) return Results.Unauthorized();
            var me = await users.GetUserAsync(http.User);
            var roles = me is null ? Array.Empty<string>() : await users.GetRolesAsync(me);
            return Results.Ok(new { me!.Id, me.Email, me.FullName, Roles = roles });
        }).RequireAuthorization();

        return app;
    }
}
