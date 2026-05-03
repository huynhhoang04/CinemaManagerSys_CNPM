using Movie.API.DTOs.Responses;
using Movie.API.Repositories;

namespace Movie.API.Services;

public class GenreService : IGenreService
{
    private readonly IGenreRepository _genreRepository;

    public GenreService(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task<IEnumerable<GenreResponseDto>> GetAllGenresAsync()
    {
        var genres = await _genreRepository.GetAllAsync();

        return genres.Select(g => new GenreResponseDto
        {
            GenreId = g.GenreId,
            GenreName = g.GenreName
        });
    }
}