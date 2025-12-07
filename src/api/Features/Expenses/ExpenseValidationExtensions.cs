namespace Api.Features.Expenses;

using Api.Data;
using Microsoft.EntityFrameworkCore;

public static class ExpenseValidationExtensions
{
    public static Task<bool> IsCategoryValidForUserAsync(
        this AppDbContext db,
        Guid categoryId,
        Guid userId,
        CancellationToken ct = default)
    {
        return db.Categories.AnyAsync(
            c => c.Id == categoryId && c.UserId == userId, ct);
    }
}