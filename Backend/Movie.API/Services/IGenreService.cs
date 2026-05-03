using Movie.API.DTOs.Requests;
using Movie.API.DTOs.Responses;

namespace Movie.API.Services;

public interface IGenreService
{
    Task<IEnumerable<GenreResponseDto>> GetAllGenresAsync();
}