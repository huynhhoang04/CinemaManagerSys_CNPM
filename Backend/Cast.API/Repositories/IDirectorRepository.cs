using Cast.API.Models;

namespace Cast.API.Repositories;

public interface IDirectorRepository
{
    Task<IEnumerable<Director>> GetAllAsync();
    Task<Director?> GetByIdAsync(int id);
    Task AddAsync(Director director);
    Task UpdateAsync(Director director);
    Task SaveChangesAsync();
}