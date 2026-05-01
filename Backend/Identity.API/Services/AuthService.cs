using Identity.API.DTOs.Requests;
using Identity.API.DTOs.Responses;

namespace Identity.API.Services;

public class AuthService : IAuthService
{
    public Task<AuthResponseDto> LoginAsync(LoginRequestDto request) => throw new NotImplementedException();
}