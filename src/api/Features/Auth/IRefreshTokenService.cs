using Api.Models;

namespace Api.Features.Auth
{
    public interface IRefreshTokenService
    {
        Task<(string rawRefreshToken, RefreshToken saved)> IssueAsync(
            Guid userId, string? ip, string? ua, string? family = null);

        Task<(string rawRefreshToken, RefreshToken saved)> RevokeAsync(
            string rawRefreshToken, string? ip, string? ua);

        Task RevokeFamilyAsync(Guid userId, string family, string? ip);

        Task RevokeAllAsync(Guid userId, string? ip);
    }
}