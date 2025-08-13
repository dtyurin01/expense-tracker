using Api.Extensions; 
using Api.Features.Auth;
using Api.Features.Categories;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services
    .AddDatabase(builder.Configuration)
    .AddIdentityAndCookies()
    .AddAppCors(builder.Configuration)
    .AddSwaggerMinimal(); 

var app = builder.Build();

await app.InitializeDatabaseAsync();

// Pipeline
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseSwaggerMinimal(); 

// endpoints
app.MapAuthEndpoints();
app.MapCategoryEndpoints();

app.Run();