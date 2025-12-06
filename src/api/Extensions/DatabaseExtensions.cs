namespace Api.Extensions;

using Api.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(
        this IServiceCollection services,
        IConfiguration cfg
    )
    {
        var cs = cfg.GetConnectionString("Default");
        if (string.IsNullOrEmpty(cs))
        {
            throw new InvalidOperationException("Database connection string is not configured");
        }

        services.AddDbContext<AppDbContext>(o => o.UseNpgsql(cs).UseSnakeCaseNamingConvention());

        services.AddTransient<DbSeeder>();

        return services;
    }

    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();

        await seeder.SeedAsync();
    }
}
