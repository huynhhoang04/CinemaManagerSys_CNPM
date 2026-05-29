using Cast.API.Data;
using Cast.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Cast.API.Repositories;

public class DirectorRepository : IDirectorRepository
{
    private readonly CastDbContext _context;

    public DirectorRepository(CastDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Director>> GetAllAsync()
    {
        return await _context.Directors.ToListAsync();
    }

    public async Task<Director?> GetByIdAsync(int id)
    {
        return await _context.Directors.FindAsync(id);
    }

    public async Task AddAsync(Director director)
    {
        await _context.Directors.AddAsync(director);
    }

    public async Task UpdateAsync(Director director)
    {
        _context.Directors.Update(director);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(int id)
    {
        var director = await _context.Directors.FindAsync(id);
        if (director != null)
        {
            // Xóa các liên kết many-to-many trước
            var maps = await _context.MovieDirectors.Where(md => md.DirectorId == id).ToListAsync();
            _context.MovieDirectors.RemoveRange(maps);

            _context.Directors.Remove(director);
        }
    }

    public async Task<IEnumerable<MovieDirector>> GetByMovieIdAsync(int movieId)
    {
        return await _context.MovieDirectors.Where(md => md.MovieId == movieId).ToListAsync();
    }

    public async Task ClearMovieDirectorsAsync(int movieId)
    {
        var maps = await _context.MovieDirectors.Where(md => md.MovieId == movieId).ToListAsync();
        _context.MovieDirectors.RemoveRange(maps);
    }

    public async Task AddMovieDirectorsAsync(IEnumerable<MovieDirector> movieDirectors)
    {
        await _context.MovieDirectors.AddRangeAsync(movieDirectors);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}