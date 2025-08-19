namespace Api.Models;


public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }          
    public ApplicationUser User { get; set; } = default!;

    public string TokenHash { get; set; } = default!;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RevokedAt { get; set; }
    public string? ReplacedByHash { get; set; }
    public string Family { get; set; } = Guid.NewGuid().ToString();
    public string? CreatedByIp { get; set; }
    public string? RevokedByIp { get; set; }
    public string? UserAgent { get; set; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public bool IsActive => RevokedAt is null && DateTime.UtcNow < ExpiresAt;

}