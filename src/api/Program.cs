using Api.Extensions; 
using Api.Features.Auth;
using Api.Features.Categories;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services
    .AddDatabase(builder.Configuration)
    .AddIdentityAndJwt(builder.Configuration)
    .AddAppCors(builder.Configuration)
    .AddSwaggerMinimal();

builder.Services
    .AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetSection("Jwt"))
    .Validate(o => o.ExpireMinutes > 0 && o.RefreshExpireDays > 0,
        "Durations must be positive")
    .ValidateOnStart();

var app = builder.Build();

await app.InitializeDatabaseAsync();

// Middleware - Pipeline
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseSwaggerMinimal(); 

// endpoints
app.MapAuthEndpoints();
app.MapCategoryEndpoints();


app.Run();