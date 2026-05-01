using Movie.API.Models;

namespace Movie.API.Repositories;

public class MovieRepository : IMovieRepository
{
    public Task<IEnumerable<Models.Movie>> GetAllAsync() => throw new NotImplementedException();
    public Task<Models.Movie?> GetByIdAsync(int id) => throw new NotImplementedException();
    public Task AddAsync(Models.Movie movie, List<int> genreIds) => throw new NotImplementedException();
    public Task UpdateAsync(Models.Movie movie, List<int> genreIds) => throw new NotImplementedException();
    public Task DeleteAsync(Models.Movie movie) => throw new NotImplementedException();
    public Task SaveChangesAsync() => throw new NotImplementedException();
}