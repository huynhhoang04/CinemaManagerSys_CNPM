using Microsoft.EntityFrameworkCore;
using Movie.API.Data;
using Movie.API.Models;

namespace Movie.API.Repositories;

public class MovieRepository : IMovieRepository
{
    private readonly MovieDbContext _context;

    public MovieRepository(MovieDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lấy danh sách tất cả phim, kèm thể loại (JOIN movie_genre -> genres).
    /// </summary>
    public async Task<IEnumerable<Models.Movie>> GetAllAsync()
    {
        return await _context.Movies
            .AsNoTracking()
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .OrderBy(m => m.Title)
            .ToListAsync();
    }

    /// <summary>
    /// Lấy chi tiết một phim theo Id, kèm thể loại.
    /// </summary>
    public async Task<Models.Movie?> GetByIdAsync(int id)
    {
        return await _context.Movies
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .FirstOrDefaultAsync(m => m.MovieId == id);
    }

    /// <summary>
    /// Thêm phim mới và gán genre_ids vào bảng movie_genre trong cùng 1 transaction.
    /// </summary>
    public async Task AddAsync(Models.Movie movie, List<int> genreIds)
    {
        await _context.Movies.AddAsync(movie);
        await _context.SaveChangesAsync(); // Lấy MovieId được sinh ra

        var movieGenres = genreIds
            .Distinct()
            .Select(gid => new MovieGenre { MovieId = movie.MovieId, GenreId = gid });

        await _context.MovieGenres.AddRangeAsync(movieGenres);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Cập nhật thông tin phim và đồng bộ lại genre_ids:
    ///   - Xóa map cũ, ghi map mới cho movie_genre.
    /// </summary>
    public async Task UpdateAsync(Models.Movie movie, List<int> genreIds)
    {
        _context.Movies.Update(movie);

        // Xóa tất cả map cũ của phim này
        var oldMappings = _context.MovieGenres.Where(mg => mg.MovieId == movie.MovieId);
        _context.MovieGenres.RemoveRange(oldMappings);

        // Thêm map mới
        var newMappings = genreIds
            .Distinct()
            .Select(gid => new MovieGenre { MovieId = movie.MovieId, GenreId = gid });
        await _context.MovieGenres.AddRangeAsync(newMappings);

        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Xóa phim và tự động dọn rác bảng movie_genre (do không có Cascade Delete tự động).
    /// </summary>
    public async Task DeleteAsync(Models.Movie movie)
    {
        var mappings = _context.MovieGenres.Where(mg => mg.MovieId == movie.MovieId);
        _context.MovieGenres.RemoveRange(mappings);
        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}