using Microsoft.EntityFrameworkCore;
using Movie.API.Data;
using Movie.API.Models;

namespace Movie.API.Repositories;

public class GenreRepository : IGenreRepository
{
    private readonly MovieDbContext _context;

    public GenreRepository(MovieDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Genre>> GetAllAsync()
    {
        return await _context.Genres
            .AsNoTracking()
            .OrderBy(g => g.GenreName)
            .ToListAsync();
    }
}