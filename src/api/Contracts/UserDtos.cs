namespace Api.Contracts
{
    public record UserProfileDto(
        Guid Id,
        string Email,
        string UserName,
        string FullName,
        string? AvatarUrl,
        string Currency,
        IList<string> Roles
    );
}
