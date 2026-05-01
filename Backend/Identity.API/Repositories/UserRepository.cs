using Identity.API.Models;

namespace Identity.API.Repositories;

public class UserRepository : IUserRepository
{
    public Task<IEnumerable<User>> GetAllUsersAsync() => throw new NotImplementedException();
    public Task<User?> GetUserByIdAsync(int id) => throw new NotImplementedException();
    public Task<User?> GetUserByUsernameAsync(string username) => throw new NotImplementedException();
    public Task CreateUserAsync(User user) => throw new NotImplementedException();
    public Task UpdateUserAsync(User user) => throw new NotImplementedException();
    public Task DeleteUserAsync(User user) => throw new NotImplementedException();
    public Task SaveChangesAsync() => throw new NotImplementedException();
}