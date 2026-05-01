using Identity.API.DTOs.Requests;
using Identity.API.DTOs.Responses;

namespace Identity.API.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task CreateUserAsync(CreateUserRequestDto request);
    Task UpdateUserAsync(int id, UpdateUserRequestDto request);
    Task PromoteUserAsync(int id);
    Task DeleteUserAsync(int id);
}