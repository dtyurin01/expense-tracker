namespace Api.Data;

using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class DbSeeder(
    AppDbContext db,
    UserManager<ApplicationUser> users,
    RoleManager<ApplicationRole> roles,
    IConfiguration cfg
)
{
    private readonly AppDbContext _db = db;
    private readonly UserManager<ApplicationUser> _users = users;
    private readonly RoleManager<ApplicationRole> _roles = roles;
    private readonly IConfiguration _cfg = cfg;

    public async Task SeedAsync()
    {
        await _db.Database.MigrateAsync();

        foreach (var name in new[] { "Admin", "User" })
        {
            if (!await _roles.RoleExistsAsync(name))
            {
                await _roles.CreateAsync(new ApplicationRole { Name = name });
            }
        }

        var adminEmail = _cfg["Seed:AdminEmail"] ?? "admin@example.com";
        var adminPwd = _cfg["Seed:AdminPassword"] ?? "admin3212##";

        var admin = await _users.FindByEmailAsync(adminEmail);
        if (admin is null)
        {
            admin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FullName = "Admin",
            };
            var res = await _users.CreateAsync(admin, adminPwd);
            if (res.Succeeded)
            {
                await _users.AddToRoleAsync(admin, "Admin");
            }
        }

        if (!await _db.Categories.AnyAsync(c => c.UserId == admin!.Id))
        {
            _db.Categories.AddRange(
                new Category { UserId = admin!.Id, Name = "Food" },
                new Category { UserId = admin!.Id, Name = "Transport" },
                new Category { UserId = admin!.Id, Name = "Rent" },
                new Category { UserId = admin!.Id, Name = "Utilities" },
                new Category { UserId = admin!.Id, Name = "Entertainment" }
            );
            await _db.SaveChangesAsync();
        }

        if (!await _db.Expenses.AnyAsync(e => e.UserId == admin!.Id))
        {
            var cats = await _db
                .Categories.Where(c => c.UserId == admin!.Id)
                .ToDictionaryAsync(c => c.Name, c => c.Id);

            var today = DateTime.UtcNow;

            _db.Expenses.AddRange(
                new Expense
                {
                    UserId = admin!.Id,
                    CategoryId = cats["Food"],
                    Amount = 15.50m,
                    Note = "Business Lunch",
                    OccurredAt = today.AddHours(-4),
                },
                new Expense
                {
                    UserId = admin!.Id,
                    CategoryId = cats["Food"],
                    Amount = 45.00m,
                    Note = "Grocery shopping",
                    OccurredAt = today.AddDays(-2),
                },
                new Expense
                {
                    UserId = admin!.Id,
                    CategoryId = cats["Transport"],
                    Amount = 2.50m,
                    Note = "Subway ticket",
                    OccurredAt = today.AddDays(-1),
                },
                new Expense
                {
                    UserId = admin!.Id,
                    CategoryId = cats["Utilities"],
                    Amount = 120.00m,
                    Note = "Internet Bill",
                    OccurredAt = today.AddDays(-10),
                },
                new Expense
                {
                    UserId = admin!.Id,
                    CategoryId = cats["Entertainment"],
                    Amount = 14.99m,
                    Note = "Netflix Subscription",
                    OccurredAt = today.AddDays(-5),
                }
            );

            await _db.SaveChangesAsync();
        }
    }
}
