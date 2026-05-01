using Schedule.API.Models;

namespace Schedule.API.Repositories;

public class ShowtimeRepository : IShowtimeRepository
{
    public Task<IEnumerable<Showtime>> GetByMovieIdAsync(int movieId) => throw new NotImplementedException();
    public Task<IEnumerable<Showtime>> GetByRoomIdAsync(int roomId) => throw new NotImplementedException();
    public Task<Showtime?> GetByIdAsync(int id) => throw new NotImplementedException();
    public Task<bool> IsRoomAvailableAsync(int roomId, DateTime startTime) => throw new NotImplementedException();
    public Task AddAsync(Showtime showtime) => throw new NotImplementedException();
    public Task UpdateAsync(Showtime showtime) => throw new NotImplementedException();
    public Task DeleteAsync(Showtime showtime) => throw new NotImplementedException();
    public Task SaveChangesAsync() => throw new NotImplementedException();
}