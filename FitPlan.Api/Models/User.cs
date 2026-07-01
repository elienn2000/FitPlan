using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitPlan.Api.Models;

/*
CLASS NAME: User
DESCRIPTION: Represents a user with their personal information and associated roles.
*/

[Table("Users")]
public class User : IBaseEntity
{
    [Key]
    public int Id { get; set; }

    // Descriptive properties of the user
    public required string Email { get; set; } // Email is used as a unique identifier for the user and is required for authentication and communication purposes.
    public required string FirstName { get; set; } // FirstName is used to store the user's first name and is required for identification
    public required string LastName { get; set; } // LastName is used to store the user's last name and is required for identification
    public required string PasswordHash { get; set; } // PasswordHash is used to store the hashed version of the user's password for security purposes. It is required to ensure that the user has a password set.
    public string Role { get; set; } = "User"; // Role is used to define the user's role within the application (e.g., "User", "Trainer").
    public DateTime CreationDate { get; set; } = DateTime.UtcNow; // CreationDate is used to store the date and time when the user was created. It is initialized to the current UTC date and time when a new user is created.
}