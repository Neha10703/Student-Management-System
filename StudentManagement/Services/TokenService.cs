using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace StudentManagement.Services
{
    // Responsible for generating JWT tokens for authenticated users
    public class TokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(string username, string fullName = "")
        {
            // Create a security key from the secret in appsettings.json
            var secretKey = _configuration["Jwt:Key"]!;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            // Use HMAC SHA256 to sign the token
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Add user info as claims inside the token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim("FullName", fullName)
            };

            // Build the token with issuer, audience, expiry and claims
            var token = new JwtSecurityToken(
                issuer:             _configuration["Jwt:Issuer"],
                audience:           _configuration["Jwt:Audience"],
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(8),
                signingCredentials: signingCredentials
            );

            // Serialize the token to a string and return it
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
