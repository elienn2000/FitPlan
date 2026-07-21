using FitPlan.Api.Data;
using FitPlan.Api.DTOs;
using FitPlan.Api.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    public class UpdateDescriptionDto
    {
        public string Description { get; set; }
    }

    [HttpPatch("Me/Description")]
    public async Task<IActionResult> UpdateDescription([FromBody] UpdateDescriptionDto dto)
    {
        // Extract the user ID from the JWT token
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized("Invalid token or missing ID.");
        }

        // Find the user in the database
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Update only the description field
        user.Description = dto.Description;

        // Save changes to the database
        await _context.SaveChangesAsync();

        return Ok(new { message = "Description updated successfully!" });
    }
}