using Facility.API.Models;

namespace Facility.API.Repositories;

public interface ITheatreRepository
{
    Task<IEnumerable<Theatre>> GetAllAsync();
    Task<Theatre?> GetByIdAsync(int id);
    Task AddAsync(Theatre theatre);
    Task UpdateAsync(Theatre theatre);
    Task SaveChangesAsync();
}