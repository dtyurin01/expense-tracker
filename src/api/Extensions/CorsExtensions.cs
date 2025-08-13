namespace Api.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddAppCors(this IServiceCollection services, IConfiguration cfg)
    {
        var allowed = (cfg["AllowedOrigins"] ?? "")
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        services.AddCors(opt =>
        {
            opt.AddDefaultPolicy(p =>
            {
                if (allowed.Length > 0)
                    p.WithOrigins(allowed).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                else
                    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
            });
        });

        return services;
    }
}