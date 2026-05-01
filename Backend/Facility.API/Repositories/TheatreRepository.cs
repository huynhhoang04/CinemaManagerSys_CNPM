using Facility.API.Models;

namespace Facility.API.Repositories;

public class TheatreRepository : ITheatreRepository
{
    public Task<IEnumerable<Theatre>> GetAllAsync() => throw new NotImplementedException();
    public Task<Theatre?> GetByIdAsync(int id) => throw new NotImplementedException();
    public Task AddAsync(Theatre theatre) => throw new NotImplementedException();
    public Task UpdateAsync(Theatre theatre) => throw new NotImplementedException();
    public Task SaveChangesAsync() => throw new NotImplementedException();
}