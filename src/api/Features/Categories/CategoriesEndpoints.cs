using Api.Contracts;
using Api.Data;
using Api.Infrastucture.Web;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Categories;

public static class CategoriesEndpoints
{
    public static IEndpointRouteBuilder MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("categories").RequireAuthorization();

        // GET /api/categories
        g.MapGet("/", async (AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            if (me is null) return Results.Unauthorized();

            var rows = await db.Categories
                .Where(c => c.UserId == me.Id)
                .OrderBy(c => c.Name)
                .Select(c => new CategoryDto(c.Id, c.Name))
                .ToListAsync();

            return Results.Ok(rows);
        });

        // GET /api/categories/{id}
        g.MapGet("/{id:guid}", async (Guid id, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            if (me is null) return Results.Unauthorized();

            var dto = await db.Categories
                .Where(c => c.UserId == me.Id && c.Id == id)
                .Select(c => new CategoryDto(c.Id, c.Name))
                .FirstOrDefaultAsync();

            return dto is null ? Results.NotFound() : Results.Ok(dto);
        })
        .WithName("GetCategoryById");

        // POST /api/categories
        g.MapPost("/", async (CreateCategoryDto dto, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            if (me is null) return Results.Unauthorized();

            var name = dto.Name.Trim();
            var exists = await db.Categories.AnyAsync(c => c.UserId == me.Id && c.Name == name);
            if (exists) return Results.Conflict($"Category '{name}' already exists.");

            var entity = new Category { Id = Guid.NewGuid(), UserId = me.Id, Name = name };
            db.Categories.Add(entity);
            await db.SaveChangesAsync();

            var result = new CategoryDto(entity.Id, entity.Name);
            return Results.CreatedAtRoute("GetCategoryById", new { id = entity.Id }, result);
        })
        .AddEndpointFilter<ValidateFilter<CreateCategoryDto>>();

        // PUT /api/categories/{id}
        g.MapPut("/{id:guid}", async (Guid id, UpdateCategoryDto dto, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            if (me is null) return Results.Unauthorized();

            var entity = await db.Categories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == me.Id);
            if (entity is null) return Results.NotFound();

            var newName = dto.Name.Trim();
            var dup = await db.Categories.AnyAsync(c => c.UserId == me.Id && c.Name == newName && c.Id != id);
            if (dup) return Results.Conflict($"Category '{newName}' already exists.");

            entity.Name = newName;
            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .AddEndpointFilter<ValidateFilter<UpdateCategoryDto>>();

        // DELETE /api/categories/{id}
        g.MapDelete("/{id:guid}", async (Guid id, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            if (me is null) return Results.Unauthorized();

            var entity = await db.Categories.Include(c => c.Expenses)
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == me.Id);
            if (entity is null) return Results.NotFound();

            if (entity.Expenses.Any())
                return Results.Conflict("Category has expenses, cannot delete."); // из-за OnDelete.Restrict

            db.Categories.Remove(entity);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        return app;
    }
}
