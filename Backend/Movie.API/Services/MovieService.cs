using Movie.API.DTOs.Requests;
using Movie.API.DTOs.Responses;
using Movie.API.Repositories;

namespace Movie.API.Services;

public class MovieService : IMovieService
{
    private readonly IMovieRepository _movieRepository;

    public MovieService(IMovieRepository movieRepository)
    {
        _movieRepository = movieRepository;
    }

    // ─── Helper: Map Model → Response DTO ─────────────────────────────────────
    private static MovieResponseDto MapToDto(Models.Movie movie)
    {
        return new MovieResponseDto
        {
            MovieId     = movie.MovieId,
            Title       = movie.Title,
            Description = movie.Description,
            PosterUrl   = movie.PosterUrl,
            TrailerUrl  = movie.TrailerUrl,
            Duration    = movie.Duration,
            ReleaseDate = movie.ReleaseDate,
            MovieStatus = movie.MovieStatus,
            Genres      = movie.MovieGenres
                               .Select(mg => new GenreResponseDto
                               {
                                   GenreId   = mg.Genre.GenreId,
                                   GenreName = mg.Genre.GenreName
                               })
                               .ToList()
        };
    }

    // ─── GET /api/movie ────────────────────────────────────────────────────────
    public async Task<IEnumerable<MovieResponseDto>> GetAllMoviesAsync()
    {
        var movies = await _movieRepository.GetAllAsync();
        return movies.Select(MapToDto);
    }

    // ─── GET /api/movie/{id} ───────────────────────────────────────────────────
    public async Task<MovieResponseDto?> GetMovieByIdAsync(int id)
    {
        var movie = await _movieRepository.GetByIdAsync(id);
        return movie is null ? null : MapToDto(movie);
    }

    // ─── POST /api/movie ───────────────────────────────────────────────────────
    /// <summary>
    /// Tạo phim mới và tự động map thể loại vào bảng movie_genre trong 1 Transaction.
    /// </summary>
    public async Task<MovieResponseDto> CreateMovieAsync(MovieRequestDto dto)
    {
        var movie = new Models.Movie
        {
            Title       = dto.Title,
            Description = dto.Description,
            PosterUrl   = dto.PosterUrl,
            TrailerUrl  = dto.TrailerUrl,
            Duration    = dto.Duration,
            ReleaseDate = dto.ReleaseDate,
            MovieStatus = dto.MovieStatus
        };

        await _movieRepository.AddAsync(movie, dto.GenreIds);

        // Reload để có đầy đủ navigation (Genres)
        var created = await _movieRepository.GetByIdAsync(movie.MovieId);
        return MapToDto(created!);
    }

    // ─── PUT /api/movie/{id} ───────────────────────────────────────────────────
    /// <summary>
    /// Cập nhật phim: ghi mới thông tin + xóa map cũ, ghi map mới cho movie_genre.
    /// </summary>
    public async Task<MovieResponseDto?> UpdateMovieAsync(int id, MovieRequestDto dto)
    {
        var movie = await _movieRepository.GetByIdAsync(id);
        if (movie is null) return null;

        movie.Title       = dto.Title;
        movie.Description = dto.Description;
        movie.PosterUrl   = dto.PosterUrl;
        movie.TrailerUrl  = dto.TrailerUrl;
        movie.Duration    = dto.Duration;
        movie.ReleaseDate = dto.ReleaseDate;
        movie.MovieStatus = dto.MovieStatus;

        await _movieRepository.UpdateAsync(movie, dto.GenreIds);

        var updated = await _movieRepository.GetByIdAsync(id);
        return MapToDto(updated!);
    }

    // ─── DELETE /api/movie/{id} ────────────────────────────────────────────────
    /// <summary>
    /// Xóa phim và tự động dọn rác bảng movie_genre.
    /// </summary>
    public async Task<bool> DeleteMovieAsync(int id)
    {
        var movie = await _movieRepository.GetByIdAsync(id);
        if (movie is null) return false;

        await _movieRepository.DeleteAsync(movie);
        return true;
    }
}