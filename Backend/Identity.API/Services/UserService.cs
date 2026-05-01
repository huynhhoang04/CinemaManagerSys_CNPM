using Identity.API.DTOs.Requests;
using Identity.API.DTOs.Responses;

namespace Identity.API.Services;

public class UserService : IUserService
{
    public Task<IEnumerable<UserDto>> GetAllUsersAsync() => throw new NotImplementedException();
    public Task CreateUserAsync(CreateUserRequestDto request) => throw new NotImplementedException();
    public Task UpdateUserAsync(int id, UpdateUserRequestDto request) => throw new NotImplementedException();
    public Task PromoteUserAsync(int id) => throw new NotImplementedException();
    public Task DeleteUserAsync(int id) => throw new NotImplementedException();
}