using Cast.API.Data;
using Cast.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Cast.API.Repositories;

public class ActorRepository : IActorRepository
{
    private readonly CastDbContext _context;

    public ActorRepository(CastDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Actor>> GetAllAsync()
    {
        return await _context.Actors.ToListAsync();
    }

    public async Task<Actor?> GetByIdAsync(int id)
    {
        return await _context.Actors.FindAsync(id);
    }

    public async Task AddAsync(Actor actor)
    {
        await _context.Actors.AddAsync(actor);
    }

    public async Task UpdateAsync(Actor actor)
    {
        _context.Actors.Update(actor);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(int id)
    {
        var actor = await _context.Actors.FindAsync(id);
        if (actor != null)
        {
            // Xóa các liên kết many-to-many trước
            var maps = await _context.MovieActors.Where(ma => ma.ActorId == id).ToListAsync();
            _context.MovieActors.RemoveRange(maps);
            
            _context.Actors.Remove(actor);
        }
    }

    public async Task<IEnumerable<MovieActor>> GetByMovieIdAsync(int movieId)
    {
        return await _context.MovieActors.Where(ma => ma.MovieId == movieId).ToListAsync();
    }

    public async Task ClearMovieActorsAsync(int movieId)
    {
        var maps = await _context.MovieActors.Where(ma => ma.MovieId == movieId).ToListAsync();
        _context.MovieActors.RemoveRange(maps);
    }

    public async Task AddMovieActorsAsync(IEnumerable<MovieActor> movieActors)
    {
        await _context.MovieActors.AddRangeAsync(movieActors);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}