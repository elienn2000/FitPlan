using Microsoft.EntityFrameworkCore;
using FitPlan.Api.Data;
using FitPlan.Api.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FitPlan.Api.Services;


var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();
builder.Services.AddScoped<ITokenService, TokenService>(); // Register the TokenService for dependency injection

// Register DbCOntext with PostgreSQL connection string from configuration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


// Registers the generic repository for dependency injection
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Swagger generation for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { 
        Title = "FitPlan API", 
        Version = "v1",
        Description = "Fitplan Backend API"
    });
});

// JWT Authentication configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, 
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure CORS middleware to allow requests from Angular frontend
app.UseCors("AllowAngular");

// Configure authentication and authorization middleware
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Swagger middleware for development environment
if (app.Environment.IsDevelopment())
{
    // Enable Swagger UI in development environment
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "FitPlan API v1");
        // Opzionale: lascia la rotta vuota per avere Swagger direttamente sulla root (es. localhost:5000/)
        // options.RoutePrefix = string.Empty; 
    });
}


app.MapControllers();

app.Run();
