using Cast.API.Models;

namespace Cast.API.Repositories;

public interface IDirectorRepository
{
    Task<IEnumerable<Director>> GetAllAsync();
    Task<Director?> GetByIdAsync(int id);
    Task AddAsync(Director actor);
    Task UpdateAsync(Director actor);
    Task DeleteAsync(int id);
    Task<IEnumerable<MovieDirector>> GetByMovieIdAsync(int movieId);
    Task ClearMovieDirectorsAsync(int movieId);
    Task AddMovieDirectorsAsync(IEnumerable<MovieDirector> movieDirectors);
    Task SaveChangesAsync();
}