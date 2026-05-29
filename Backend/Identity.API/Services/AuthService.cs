using Identity.API.DTOs.Requests;
using Identity.API.DTOs.Responses;
using Identity.API.Repositories;
using BC = BCrypt.Net.BCrypt;

namespace Identity.API.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetUserByUsernameAsync(request.Username);
        if (user == null)
            return null;

        if (!BC.Verify(request.Password, user.Password))
            return null;

        var token = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Role = user.Role,
            Fullname = user.FullName
        };
    }
}