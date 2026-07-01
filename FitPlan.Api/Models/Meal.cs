using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitPlan.Api.Models;

/*
CLASS NAME: Meal
DESCRIPTION: Represents a meal with its nutritional information and associated user.
*/

[Table("Meals")]

public class Meal : IBaseEntity
{
    // Primary key 
    [Key]
    public int Id { get; set; }

    // Descriptive properties of the meal item
    public required string Name { get; set; } // Name of the meal item
    public int Calories { get; set; } // Total calories in the meal item
    public decimal ServingSize { get; set; } // Serving size in grams

    // Nutritional information properties
    public decimal Protein { get; set; } // Protein content in grams
    public decimal Fiber { get; set; } // Fiber content in grams
    public decimal Carbohydrates { get; set; } // Carbohydrate content in grams
    public decimal Sugar { get; set; } // Sugar content in grams
    public decimal Fats { get; set; } // Total fat content in grams
    public decimal SaturatedFats { get; set; } // Saturated fat content in grams
    public decimal Salt { get; set; } // Salt content in grams

    // Foreign key to the associated user
    public int UserId { get; set; } // Foreign key to the associated user

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    // Privacy setting for the meal item
    public bool IsPrivate { get; set; } // Indicates if the meal item is private and the user that created it is the only one that use it

    public DateTime CreationDate { get; set; } = DateTime.UtcNow; // CreationDate is used to store the date and time when the meal was created. It is initialized to the current UTC date and time when a new meal is created.

}