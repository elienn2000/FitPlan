using Microsoft.AspNetCore.Mvc;
using FitPlan.Api.Models;
using FitPlan.Api.Data;
using FitPlan.Api.Services;
using FitPlan.Api.DTOs;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService; // Il servizio che creeremo subito dopo

    public AuthController(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register(UserDto dto)
    {
        // Hashing of the password using BCrypt
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        
        // Create a new user entity
        var user = new User {
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PasswordHash = passwordHash,
            Role = "User" // Default role for now 
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User created successfully" });
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        
        // Verify password
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Save Refresh Token in the DB
        _context.RefreshTokens.Add(new RefreshToken {
            Token = refreshToken,
            UserId = user.Id,
            ExpiryDate = DateTime.UtcNow.AddDays(7)
        });
        await _context.SaveChangesAsync();

        return Ok(new { accessToken, refreshToken });
    }
}