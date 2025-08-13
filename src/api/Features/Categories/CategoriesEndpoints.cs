using Api.Contracts;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Categories;

public static class CategoriesEndpoints
{
	public static IEndpointRouteBuilder MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/categories").RequireAuthorization();

        g.MapGet("/", async (AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            var rows = await db.Categories
                .Where(c => c.UserId == me!.Id)
                .OrderBy(c => c.Name)
                .Select(c => new CategoryDto(c.Id, c.Name))  
                .ToListAsync();

            return Results.Ok(rows);
        });

        g.MapPost("/", async (CreateCategoryDto dto, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            var exists = await db.Categories.AnyAsync(c => c.UserId == me!.Id && c.Name == dto.Name);
            if (exists) return Results.Conflict($"Category '{dto.Name}' already exists.");

            db.Categories.Add(new Category { UserId = me!.Id, Name = dto.Name });
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        return app;
    }
}