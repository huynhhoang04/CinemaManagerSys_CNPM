using Identity.API.Models;
using Identity.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IdentityDbContext _context;

    public UserRepository(IdentityDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
        => await _context.Users.ToListAsync();

    public async Task<User?> GetUserByIdAsync(int id)
        => await _context.Users.FindAsync(id);

    public async Task<User?> GetUserByUsernameAsync(string username)
        => await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

    public async Task CreateUserAsync(User user)
        => await _context.Users.AddAsync(user);

    public Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        return Task.CompletedTask;
    }

    public Task DeleteUserAsync(User user)
    {
        _context.Users.Remove(user);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}