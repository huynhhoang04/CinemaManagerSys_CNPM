using System.Linq;
using Schedule.API.DTOs.Requests;
using Schedule.API.DTOs.Responses;
using Schedule.API.Models;
using Schedule.API.Repositories;

namespace Schedule.API.Services;

public class ShowtimeService : IShowtimeService
{
    private readonly IShowtimeRepository _repository;

    public ShowtimeService(IShowtimeRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ShowtimeResponseDto>> GetShowtimesByMovieIdAsync(int movieId)
    {
        var showtimes = await _repository.GetByMovieIdAsync(movieId);
        return showtimes.Select(s => new ShowtimeResponseDto
        {
            ShowtimeId = s.ShowtimeId,
            MovieId = s.MovieId,
            RoomId = s.RoomId,
            Started = s.Started,
            Price = s.Price
        });
    }

    public async Task<IEnumerable<ShowtimeResponseDto>> GetShowtimesByRoomIdAsync(int roomId)
    {
        var showtimes = await _repository.GetByRoomIdAsync(roomId);
        return showtimes.Select(s => new ShowtimeResponseDto
        {
            ShowtimeId = s.ShowtimeId,
            MovieId = s.MovieId,
            RoomId = s.RoomId,
            Started = s.Started,
            Price = s.Price
        });
    }

    public async Task<ShowtimeResponseDto?> CreateShowtimeAsync(ShowtimeRequestDto request)
    {
        if (!await _repository.IsRoomAvailableAsync(request.RoomId, request.Started))
        {
            return null; // Room not available
        }

        var showtime = new Showtime
        {
            MovieId = request.MovieId,
            RoomId = request.RoomId,
            Started = request.Started,
            Price = request.Price
        };

        await _repository.AddAsync(showtime);
        await _repository.SaveChangesAsync();

        return new ShowtimeResponseDto
        {
            ShowtimeId = showtime.ShowtimeId,
            MovieId = showtime.MovieId,
            RoomId = showtime.RoomId,
            Started = showtime.Started,
            Price = showtime.Price
        };
    }

    public async Task<ShowtimeResponseDto?> UpdateShowtimeAsync(int id, ShowtimeRequestDto request)
    {
        var showtime = await _repository.GetByIdAsync(id);
        if (showtime == null)
        {
            return null;
        }

        // Check if room is available, excluding current showtime
        var isAvailable = await _repository.IsRoomAvailableAsync(request.RoomId, request.Started);
        if (!isAvailable && (showtime.RoomId != request.RoomId || showtime.Started != request.Started))
        {
            return null; // Conflict
        }

        showtime.MovieId = request.MovieId;
        showtime.RoomId = request.RoomId;
        showtime.Started = request.Started;
        showtime.Price = request.Price;

        await _repository.UpdateAsync(showtime);
        await _repository.SaveChangesAsync();

        return new ShowtimeResponseDto
        {
            ShowtimeId = showtime.ShowtimeId,
            MovieId = showtime.MovieId,
            RoomId = showtime.RoomId,
            Started = showtime.Started,
            Price = showtime.Price
        };
    }

    public async Task<bool> DeleteShowtimeAsync(int id)
    {
        var showtime = await _repository.GetByIdAsync(id);
        if (showtime == null)
        {
            return false;
        }

        await _repository.DeleteAsync(showtime);
        await _repository.SaveChangesAsync();
        return true;
    }
}