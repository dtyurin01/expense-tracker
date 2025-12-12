using Api.Extensions;
using Api.Features.Auth;
using Api.Features.Categories;
using Api.Features.Expenses;
using Api.Features.Users;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddDatabase(builder.Configuration)
    .AddIdentityAndJwt(builder.Configuration)
    .AddAppCors(builder.Configuration)
    .AddSwaggerMinimal();

builder
    .Services.AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetSection("Jwt"))
    .Validate(o => o.ExpireMinutes > 0 && o.RefreshExpireDays > 0, "Durations must be positive")
    .ValidateOnStart();

builder
    .Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));

var app = builder.Build();

await app.InitializeDatabaseAsync();

app.UseCors();

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();
app.UseSwaggerMinimal();

app.MapAuthEndpoints();

var api = app.MapGroup("/api");
api.MapCategoryEndpoints();
api.MapExpenseEndpoints();
api.MapUsersEndpoints();

app.Run();
