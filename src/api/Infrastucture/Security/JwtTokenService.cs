using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace Api.Infrastucture.Security;

public sealed class JwtTokenService
{
    private readonly IConfiguration _cfg;
    private readonly SymmetricSecurityKey _key;

    public JwtTokenService(IConfiguration cfg)
    {
        _cfg = cfg;
        var keyStr = _cfg["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key");
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
    }

    public string Create(ApplicationUser user, IEnumerable<string> roles, string securityStamp)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique ID for the token
            new("ss", securityStamp),
        };

        if (!string.IsNullOrWhiteSpace(user.UserName))
        {
            claims.Add(new Claim(JwtRegisteredClaimNames.Name, user.UserName));
        }

        if (!string.IsNullOrWhiteSpace(user.Email))
        {
            claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
        }

        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);
        var expireMinutes = _cfg.GetValue<int>("Jwt:ExpireMinutes", 60);
        var expires = DateTime.UtcNow.AddMinutes(expireMinutes);

        var token = new JwtSecurityToken(
            issuer: _cfg["Jwt:Issuer"],
            audience: _cfg["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
