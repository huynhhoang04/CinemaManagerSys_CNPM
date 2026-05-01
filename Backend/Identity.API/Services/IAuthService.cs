using Identity.API.DTOs.Requests;
using Identity.API.DTOs.Responses;

namespace Identity.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
}