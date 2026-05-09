using Microsoft.AspNetCore.Mvc;
using StudentManagement.DTOs;
using StudentManagement.Services;

namespace StudentManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST api/auth/register
        // Creates a new user account
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var (success, message, data) = await _authService.RegisterAsync(dto);

            if (!success)
            {
                return BadRequest(new { message = message });
            }

            return Ok(data);
        }

        // POST api/auth/login
        // Logs in with username and password, returns a JWT token
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var (success, message, data) = await _authService.LoginAsync(dto);

            if (!success)
            {
                return Unauthorized(new { message = message });
            }

            return Ok(data);
        }
    }
}
