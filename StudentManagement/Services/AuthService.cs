using Microsoft.EntityFrameworkCore;
using StudentManagement.Data;
using StudentManagement.DTOs;
using StudentManagement.Models;

namespace StudentManagement.Services
{
    // Handles user registration and login
    public class AuthService
    {
        private readonly AppDbContext _db;
        private readonly TokenService _tokenService;

        public AuthService(AppDbContext db, TokenService tokenService)
        {
            _db           = db;
            _tokenService = tokenService;
        }

        // Register a new user account
        public async Task<(bool Success, string Message, AuthResponseDto? Data)> RegisterAsync(RegisterDto dto)
        {
            // Check if username is already taken
            bool usernameExists = await _db.Users.AnyAsync(u => u.Username == dto.Username);
            if (usernameExists)
            {
                return (false, "Username is already taken", null);
            }

            // Check if email is already registered
            bool emailExists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
            {
                return (false, "Email is already registered", null);
            }

            // Hash the password before saving — never store plain text passwords
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // Create the new user
            var newUser = new User
            {
                FullName     = dto.FullName,
                Username     = dto.Username,
                Email        = dto.Email,
                PasswordHash = hashedPassword
            };

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            // Generate a JWT token for the new user
            string token = _tokenService.GenerateToken(newUser.Username, newUser.FullName);

            var response = new AuthResponseDto
            {
                Token    = token,
                Username = newUser.Username,
                FullName = newUser.FullName,
                Email    = newUser.Email
            };

            return (true, "Registration successful", response);
        }

        // Login with username and password
        public async Task<(bool Success, string Message, AuthResponseDto? Data)> LoginAsync(LoginDto dto)
        {
            // Find the user by username
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null)
            {
                return (false, "Invalid username or password", null);
            }

            // Verify the password against the stored hash
            bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordCorrect)
            {
                return (false, "Invalid username or password", null);
            }

            // Generate a JWT token for the logged in user
            string token = _tokenService.GenerateToken(user.Username, user.FullName);

            var response = new AuthResponseDto
            {
                Token    = token,
                Username = user.Username,
                FullName = user.FullName,
                Email    = user.Email
            };

            return (true, "Login successful", response);
        }
    }
}
