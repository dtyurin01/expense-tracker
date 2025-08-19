namespace Api.Features.Auth;

public sealed class JwtOptions
{
    public int ExpireMinutes { get; set; } = 60;
    public int RefreshExpireDays { get; set; } = 7;
}