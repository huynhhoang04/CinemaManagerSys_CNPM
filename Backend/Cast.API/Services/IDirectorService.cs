using Cast.API.DTOs.Requests;
using Cast.API.DTOs.Responses;

namespace Cast.API.Services;

public interface IDirectorService
{
    Task<IEnumerable<DirectorResponseDto>> GetAllAsync();
    Task<DirectorResponseDto?> GetByIdAsync(int id);
    Task CreateAsync(DirectorRequestDto dto);
    Task UpdateAsync(int id, DirectorRequestDto dto);
    Task DeleteAsync(int id);
    Task<IEnumerable<DirectorResponseDto>> GetByMovieIdAsync(int movieId);
    Task AssignToMovieAsync(int movieId, IEnumerable<int> directorIds);
}