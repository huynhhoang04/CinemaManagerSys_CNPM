using Movie.API.Models;

namespace Movie.API.Repositories;

public class GenreRepository : IGenreRepository
{
    public Task<IEnumerable<Genre>> GetAllAsync() => throw new NotImplementedException();
}