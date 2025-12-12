using Api.Contracts;
using Api.Data;
using Api.Extensions;
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
        g.MapGet(
            "/",
            async (AppDbContext db, HttpContext http, CancellationToken ct) =>
            {
                var userId = http.User.GetUserId();

                var rows = await db
                    .Expenses.Where(e => e.UserId == userId)
                    .OrderByDescending(e => e.OccurredAt)
                    .Select(e => new ExpenseDto(
                        e.Id,
                        e.CategoryId,
                        e.Category.Name,
                        e.Amount,
                        e.Note,
                        e.OccurredAt
                    ))
                    .ToListAsync(ct);

                return Results.Ok(rows);
            }
        );

        // GET /api/expenses/{id}

        g.MapGet(
                "/{id:guid}",
                async (Guid id, AppDbContext db, HttpContext http, CancellationToken ct) =>
                {
                    var userId = http.User.GetUserId();

                    var dto = await db
                        .Expenses.Where(x => x.Id == id && x.UserId == userId)
                        .Select(x => new ExpenseDto(
                            x.Id,
                            x.CategoryId,
                            x.Category.Name,
                            x.Amount,
                            x.Note,
                            x.OccurredAt
                        ))
                        .FirstOrDefaultAsync(ct);

                    return dto is null ? Results.NotFound() : Results.Ok(dto);
                }
            )
            .WithName("GetExpenseById");

        // POST /api/expenses

        g.MapPost(
                "/",
                async (
                    CreateExpenseDto dto,
                    AppDbContext db,
                    HttpContext http,
                    CancellationToken ct
                ) =>
                {
                    var userId = http.User.GetUserId();

                    var catOk = await db.IsCategoryValidForUserAsync(dto.CategoryId, userId, ct);

                    if (!catOk)
                    {
                        return Results.BadRequest(new { error = "Invalid category" });
                    }

                    var entity = new Expense
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        CategoryId = dto.CategoryId,
                        Amount = decimal.Round(dto.Amount, 2),
                        Note = string.IsNullOrWhiteSpace(dto.Note) ? null : dto.Note.Trim(),
                        OccurredAt = DateTime.SpecifyKind(dto.OccurredAt, DateTimeKind.Utc),
                    };

                    db.Expenses.Add(entity);
                    await db.SaveChangesAsync(ct);

                    var catName = await db
                        .Categories.Where(c => c.Id == entity.CategoryId)
                        .Select(c => c.Name)
                        .FirstAsync(ct);

                    var result = new ExpenseDto(
                        entity.Id,
                        entity.CategoryId,
                        catName,
                        entity.Amount,
                        entity.Note,
                        entity.OccurredAt
                    );
                    return Results.CreatedAtRoute("GetExpenseById", new { id = entity.Id }, result);
                }
            )
            .AddEndpointFilter<ValidateFilter<CreateExpenseDto>>();

        // PUT /api/expenses/{id}
        g.MapPut(
                "/{id:guid}",
                async (
                    Guid id,
                    UpdateExpenseDto dto,
                    AppDbContext db,
                    HttpContext http,
                    CancellationToken ct
                ) =>
                {
                    var userId = http.User.GetUserId();

                    var entity = await db.Expenses.FirstOrDefaultAsync(
                        e => e.Id == id && e.UserId == userId,
                        ct
                    );
                    if (entity is null)
                    {
                        return Results.NotFound();
                    }

                    var catOk = await db.IsCategoryValidForUserAsync(dto.CategoryId, userId, ct);
                    if (!catOk)
                    {
                        return Results.BadRequest(new { error = "Invalid category" });
                    }

                    entity.CategoryId = dto.CategoryId;
                    entity.Amount = decimal.Round(dto.Amount, 2);
                    entity.Note = string.IsNullOrWhiteSpace(dto.Note) ? null : dto.Note.Trim();
                    entity.OccurredAt = DateTime.SpecifyKind(dto.OccurredAt, DateTimeKind.Utc);

                    await db.SaveChangesAsync(ct);
                    return Results.NoContent();
                }
            )
            .AddEndpointFilter<ValidateFilter<UpdateExpenseDto>>();

        // DELETE /api/expenses/{id}
        g.MapDelete(
            "/{id:guid}",
            async (Guid id, AppDbContext db, HttpContext http, CancellationToken ct) =>
            {
                var userId = http.User.GetUserId();

                var affectedRows = await db
                    .Expenses.Where(e => e.Id == id && e.UserId == userId)
                    .ExecuteDeleteAsync(ct);

                if (affectedRows == 0)
                {
                    return Results.NotFound();
                }

                return Results.NoContent();
            }
        );

        return app;
    }
}
