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
        var user = new User
        {
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PasswordHash = passwordHash,
            Username = dto.Username,
            Country = dto.Country,
            BirthDate = dto.BirthDate,
            Role = "User" // Default role for now 
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        //Return token?
        return Ok();
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = dto.Username == null ? await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email)
                                        : await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

        // Verify password
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Save Refresh Token in the DB
        _context.RefreshTokens.Add(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiryDate = DateTime.UtcNow.AddDays(7)
        });
        await _context.SaveChangesAsync();

        return Ok(new { accessToken, refreshToken });
    }


    [HttpGet("Username")]
    public async Task<IActionResult> GetUsername(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("User not found");

        return Ok(new { username = user.FirstName + " " + user.LastName });
    }

    [HttpGet("check-username-availability")]
    public async Task<IActionResult> CheckUsernameAvailability([FromQuery] string username)
    {
        // Check if the username is null or empty
        if (string.IsNullOrWhiteSpace(username))
            return BadRequest("Invalid username");

        // Check if the username is already taken (case-insensitive)
        bool isTaken = await _context.Users
            .AnyAsync(u => u.Username.ToLower() == username.ToLower());

        // Return the availability status
        return Ok(new { isAvailable = !isTaken });
    }

    [HttpGet("check-email-availability")]
    public async Task<IActionResult> CheckEmailAvailability([FromQuery] string email)
    {
        // Check if the email is null or empty
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest("Invalid email");

        // Check if the email is already taken (case-insensitive)
        bool isTaken = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == email.ToLower());

        // Return the availability status
        return Ok(new { isAvailable = !isTaken });
    }

}