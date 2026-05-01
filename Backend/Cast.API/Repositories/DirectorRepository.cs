// File: Repositories/DirectorRepository.cs
using Cast.API.Models;

namespace Cast.API.Repositories;

public class DirectorRepository : IDirectorRepository
{
    public Task<IEnumerable<Director>> GetAllAsync() => throw new NotImplementedException();
    public Task<Director?> GetByIdAsync(int id) => throw new NotImplementedException();
    public Task AddAsync(Director director) => throw new NotImplementedException();
    public Task UpdateAsync(Director director) => throw new NotImplementedException();
    public Task SaveChangesAsync() => throw new NotImplementedException();
}