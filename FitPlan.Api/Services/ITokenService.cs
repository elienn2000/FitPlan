using FitPlan.Api.Models;

namespace FitPlan.Api.Services;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}