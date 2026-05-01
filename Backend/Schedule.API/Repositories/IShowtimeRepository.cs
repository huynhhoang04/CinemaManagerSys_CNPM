using Schedule.API.Models;

namespace Schedule.API.Repositories;

public interface IShowtimeRepository
{
    Task<IEnumerable<Showtime>> GetByMovieIdAsync(int movieId);
    Task<IEnumerable<Showtime>> GetByRoomIdAsync(int roomId);
    Task<Showtime?> GetByIdAsync(int id);
    Task<bool> IsRoomAvailableAsync(int roomId, DateTime startTime); 
    Task AddAsync(Showtime showtime);
    Task UpdateAsync(Showtime showtime);
    Task DeleteAsync(Showtime showtime);
    Task SaveChangesAsync();
}