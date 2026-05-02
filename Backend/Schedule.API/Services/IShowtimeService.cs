using Schedule.API.DTOs.Requests;
using Schedule.API.DTOs.Responses;

namespace Schedule.API.Services;

public interface IShowtimeService
{
    Task<IEnumerable<ShowtimeResponseDto>> GetShowtimesByMovieIdAsync(int movieId);
    Task<IEnumerable<ShowtimeResponseDto>> GetShowtimesByRoomIdAsync(int roomId);
    Task<ShowtimeResponseDto?> CreateShowtimeAsync(ShowtimeRequestDto request);
    Task<ShowtimeResponseDto?> UpdateShowtimeAsync(int id, ShowtimeRequestDto request);
    Task<bool> DeleteShowtimeAsync(int id);
}