using Movie.API.DTOs.Requests;
using Movie.API.DTOs.Responses;

namespace Movie.API.Services;

public interface IMovieService
{
    Task<IEnumerable<MovieResponseDto>> GetAllMoviesAsync();
    Task<MovieResponseDto?> GetMovieByIdAsync(int id);
    Task<MovieResponseDto> CreateMovieAsync(MovieRequestDto dto);
    Task<MovieResponseDto?> UpdateMovieAsync(int id, MovieRequestDto dto);
    Task<bool> DeleteMovieAsync(int id);
}