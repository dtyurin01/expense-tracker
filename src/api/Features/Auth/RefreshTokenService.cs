using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Api.Features.Auth
{
    public sealed class RefreshTokenService(AppDbContext db, IConfiguration cfg) : IRefreshTokenService
    {

        public async Task<(string rawRefreshToken, RefreshToken saved)> IssueAsync(
            Guid userId, string? ip, string? ua, string? family = null)
        {
            var raw = GenerateRaw(64);
            var hash = Hash(raw);
            var days = int.Parse(cfg["Jwt:RefreshExpireDays"] ?? "7"); 

            var rt = new RefreshToken
            {
                UserId = userId,
                TokenHash = hash,
                ExpiresAt = DateTime.UtcNow.AddDays(days),
                CreatedByIp = ip,
                UserAgent = ua,
                Family = family ?? Guid.NewGuid().ToString()
            };

            db.RefreshTokens.Add(rt);
            await db.SaveChangesAsync();
            return (raw, rt);
        }

        public async Task<(string rawRefreshToken, RefreshToken saved)> RevokeAsync(
            string rawRefreshToken, string? ip, string? ua)
        {
            var oldHash = Hash(rawRefreshToken);

            var old = await db.RefreshTokens.SingleOrDefaultAsync(x => x.TokenHash == oldHash);
            if (old is null)
                throw new SecurityException("Refresh token not found");

            if (old.RevokedAt is not null)
            {
                await RevokeFamilyAsync(old.UserId, old.Family, ip); 
                throw new SecurityException("Refresh token reused");
            }

            if (DateTime.UtcNow >= old.ExpiresAt)
            {
                throw new SecurityException("Refresh token expired");
            }

            var (rawNew, newRt) = await IssueAsync(old.UserId, ip, ua, old.Family);

            old.RevokedAt = DateTime.UtcNow;
            old.RevokedByIp = ip;
            old.ReplacedByHash = newRt.TokenHash;

            await db.SaveChangesAsync();
            return (rawNew, newRt);
        }

        public async Task RevokeFamilyAsync(Guid userId, string family, string? ip)
        {
            var toks = await db.RefreshTokens
                .Where(x => x.UserId == userId && x.Family == family && x.RevokedAt == null)
                .ToListAsync();

            foreach (var t in toks)
            {
                t.RevokedAt = DateTime.UtcNow;
                t.RevokedByIp = ip;
            }
            await db.SaveChangesAsync();
        }

        public async Task RevokeAllAsync(Guid userId, string? ip)
        {
            var toks = await db.RefreshTokens
                .Where(x => x.UserId == userId && x.RevokedAt == null)
                .ToListAsync();

            foreach (var t in toks)
            {
                t.RevokedAt = DateTime.UtcNow;
                t.RevokedByIp = ip;
            }
            await db.SaveChangesAsync();
        }

        private static string GenerateRaw(int bytes) =>
            Convert.ToBase64String(RandomNumberGenerator.GetBytes(bytes));

        private static string Hash(string raw)
        {
            using var sha = SHA256.Create();
            return Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(raw)));
        }
    }

    public sealed class SecurityException : Exception
    {
        public SecurityException(string m) : base(m) { }
    }
}
