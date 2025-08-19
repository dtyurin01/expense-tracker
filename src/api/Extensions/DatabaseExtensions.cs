namespace Api.Extensions;

using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration cfg)
    {
        var cs = cfg.GetConnectionString("Default");
        if (string.IsNullOrEmpty(cs))
            throw new InvalidOperationException("Database connection string is not configured");

        services.AddDbContext<AppDbContext>(o => o.UseNpgsql(cs));
        return services;
    }

    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roles = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
        var cfg = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        await db.Database.MigrateAsync();

        foreach (var name in new[] { "Admin", "User" })
            if (!await roles.RoleExistsAsync(name))
                await roles.CreateAsync(new ApplicationRole { Name = name });

        var adminEmail = cfg["Seed:AdminEmail"] ?? "admin@local";
        var adminPwd = cfg["Seed:AdminPassword"] ?? "Change_me_123!";
        var admin = await users.FindByEmailAsync(adminEmail);
        if (admin is null)
        {
            admin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true, FullName = "Admin" };
            var res = await users.CreateAsync(admin, adminPwd);
            if (res.Succeeded) await users.AddToRoleAsync(admin, "Admin");
        }

        if (!await db.Categories.AnyAsync(c => c.UserId == admin!.Id))
        {
            db.Categories.AddRange(
                new Category { UserId = admin!.Id, Name = "Food" },
                new Category { UserId = admin!.Id, Name = "Transport" },
                new Category { UserId = admin!.Id, Name = "Rent" },
                new Category { UserId = admin!.Id, Name = "Utilities" }
            );
            await db.SaveChangesAsync();
        }
    }
}
