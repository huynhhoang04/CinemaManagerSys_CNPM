using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Identity.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace Identity.API.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

        var claims = new List<Claim>
        {
            new Claim("sub", user.UserId.ToString()),
            new Claim("jti", Guid.NewGuid().ToString()),
            new Claim("unique_name", user.Username),
            new Claim("fullname", user.FullName),
            new Claim("role", user.Role)
        };

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expireHours = int.Parse(jwtSettings["ExpireHours"] ?? "24");

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expireHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}