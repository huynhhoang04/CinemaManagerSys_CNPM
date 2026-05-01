using Movie.API.Models;

namespace Movie.API.Repositories;

public interface IMovieRepository
{
    Task<IEnumerable<Models.Movie>> GetAllAsync();
    Task<Models.Movie?> GetByIdAsync(int id);
    Task AddAsync(Models.Movie movie, List<int> genreIds);
    Task UpdateAsync(Models.Movie movie, List<int> genreIds);
    Task DeleteAsync(Models.Movie movie);
    Task SaveChangesAsync();
}