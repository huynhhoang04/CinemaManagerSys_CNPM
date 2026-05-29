using Cast.API.Models;

namespace Cast.API.Repositories;

public interface IActorRepository
{
    Task<IEnumerable<Actor>> GetAllAsync();
    Task<Actor?> GetByIdAsync(int id);
    Task AddAsync(Actor actor);
    Task UpdateAsync(Actor actor);
    Task DeleteAsync(int id);
    Task<IEnumerable<MovieActor>> GetByMovieIdAsync(int movieId);
    Task ClearMovieActorsAsync(int movieId);
    Task AddMovieActorsAsync(IEnumerable<MovieActor> movieActors);
    Task SaveChangesAsync();
}