using Movie.API.Models;

namespace Movie.API.Repositories;

public interface IGenreRepository
{
    Task<IEnumerable<Genre>> GetAllAsync();
}