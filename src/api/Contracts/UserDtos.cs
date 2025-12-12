namespace Api.Contracts
{
    public record UserProfileDto(
        Guid Id,
        string Email,
        string UserName,
        string? AvatarUrl,
        string Currency,
        IList<string> Roles
    );
}
