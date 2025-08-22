
using Api.Contracts;
using Api.Data;
using Api.Infrastucture.Web;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;    

namespace Api.Features.Expenses;


public static class ExpensesEndpoints
{
    public static IEndpointRouteBuilder MapExpenseEndpoints(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("expenses").RequireAuthorization();

        // GET /api/expenses
        g.MapGet("/", async (AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {

            var me = await users.GetUserAsync(http.User);
            if (me is null) return Results.Unauthorized();
            var rows = await db.Expenses
                .Where(e => e.UserId == me.Id)
                .OrderByDescending(e => e.OccurredAt)
                .Select(e => new ExpenseDto(e.Id, e.CategoryId, e.Category.Name, e.Amount, e.Note, e.OccurredAt))
                .ToListAsync();
            return Results.Ok(rows);
        });

        // GET /api/expenses/{id}

        g.MapGet("/{id:guid}", async (Guid id, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
            {
                var me = await users.GetUserAsync(http.User);
                if (me is null) return Results.Unauthorized();

                var dto = await db.Expenses
                    .Where(x => x.Id == id && x.UserId == me.Id)
                    .Select(x => new ExpenseDto(x.Id, x.CategoryId, x.Category.Name, x.Amount, x.Note, x.OccurredAt))
                    .FirstOrDefaultAsync();

                return dto is null ? Results.NotFound() : Results.Ok(dto);
            }).WithName("GetExpenseById");

        // POST /api/expenses
        g.MapPost("/", async (CreateExpenseDto dto, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
        {
            var me = await users.GetUserAsync(http.User);
            if (me is null) return Results.Unauthorized();

            var catOk = await db.Categories.AnyAsync(c => c.Id == dto.CategoryId && c.UserId == me.Id);
            if (!catOk) return Results.BadRequest(new { error = "Invalid category" });

            var entity = new Expense
            {
                Id = Guid.NewGuid(),
                UserId = me.Id,
                CategoryId = dto.CategoryId,
                Amount = decimal.Round(dto.Amount, 2),
                Note = string.IsNullOrWhiteSpace(dto.Note) ? null : dto.Note.Trim(),
                OccurredAt = DateTime.SpecifyKind(dto.OccurredAt, DateTimeKind.Utc)
            };

            db.Expenses.Add(entity);
            await db.SaveChangesAsync();

            var catName = await db.Categories.Where(c => c.Id == entity.CategoryId).Select(c => c.Name).FirstAsync();
            var result = new ExpenseDto(entity.Id, entity.CategoryId, catName, entity.Amount, entity.Note, entity.OccurredAt);
            return Results.CreatedAtRoute("GetExpenseById", new { id = entity.Id }, result);

        }).AddEndpointFilter<ValidateFilter<CreateExpenseDto>>();
        // PUT /api/expenses/{id}
        g.MapPut("/{id:guid}", async (Guid id, UpdateExpenseDto dto, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
            {
                var me = await users.GetUserAsync(http.User);
                if (me is null) return Results.Unauthorized();

                var entity = await db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == me.Id);
                if (entity is null) return Results.NotFound();

                var catOk = await db.Categories.AnyAsync(c => c.Id == dto.CategoryId && c.UserId == me.Id);
                if (!catOk) return Results.BadRequest(new { error = "Invalid category" });

                entity.CategoryId = dto.CategoryId;
                entity.Amount = decimal.Round(dto.Amount, 2);
                entity.Note = string.IsNullOrWhiteSpace(dto.Note) ? null : dto.Note.Trim();
                entity.OccurredAt = DateTime.SpecifyKind(dto.OccurredAt, DateTimeKind.Utc);

                await db.SaveChangesAsync();
                return Results.NoContent();
            })
            .AddEndpointFilter<ValidateFilter<UpdateExpenseDto>>();

        // DELETE /api/expenses/{id}
        g.MapDelete("/{id:guid}", async (Guid id, AppDbContext db, UserManager<ApplicationUser> users, HttpContext http) =>
            {
                var me = await users.GetUserAsync(http.User);
                if (me is null) return Results.Unauthorized();

                var entity = await db.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == me.Id);
                if (entity is null) return Results.NotFound();

                db.Expenses.Remove(entity);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });

        return app;
    }
}