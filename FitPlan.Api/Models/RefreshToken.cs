using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitPlan.Api.Models;


/*
CLASS NAME: RefreshToken
DESCRIPTION: Represents a refresh token used for JWT authentication, associated with a user.
*/

public class RefreshToken : IBaseEntity
{
    [Key]
    public int Id { get; set; } 

    // properties of the refresh token
    public required string Token { get; set; } // The actual refresh token string
    public DateTime ExpiryDate { get; set; } // The date and time when the refresh token expires
    public bool IsUsed { get; set; } // Indicates whether the refresh token has been used
    public bool IsRevoked { get; set; } // Indicates whether the refresh token has been revoked
    public int UserId { get; set; } // Foreign key to the associated user

    [ForeignKey(nameof(UserId))] 
    public User User { get; set; } = null!; // Navigation property to the associated user
    
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
}