using Cast.API.DTOs.Requests;
using Cast.API.DTOs.Responses;

namespace Cast.API.Services;

public interface IActorService
{
    Task<IEnumerable<ActorResponseDto>> GetAllAsync();
    Task<ActorResponseDto?> GetByIdAsync(int id);
    Task CreateAsync(ActorRequestDto dto);
    Task UpdateAsync(int id, ActorRequestDto dto);
    Task DeleteAsync(int id);
    Task<IEnumerable<MovieActorResponseDto>> GetByMovieIdAsync(int movieId);
    Task AssignToMovieAsync(int movieId, IEnumerable<MovieActorMapDto> actorMaps);
}