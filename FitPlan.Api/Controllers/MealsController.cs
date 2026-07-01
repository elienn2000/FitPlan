using FitPlan.Api.Models;
using FitPlan.Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]

public class MealsController(IRepository<Meal> repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => 
        Ok(await repository.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create(Meal meal)
    {
        await repository.AddAsync(meal);
        await repository.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = meal.Id }, meal);
    }
}