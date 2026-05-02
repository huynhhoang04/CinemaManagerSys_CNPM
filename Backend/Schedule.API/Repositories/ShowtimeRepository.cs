using Microsoft.EntityFrameworkCore;
using Schedule.API.Data;
using Schedule.API.Models;

namespace Schedule.API.Repositories;

public class ShowtimeRepository : IShowtimeRepository
{
    private readonly ScheduleDbContext _context;

    public ShowtimeRepository(ScheduleDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Showtime>> GetByMovieIdAsync(int movieId)
    {
        return await _context.Showtimes
            .Where(s => s.MovieId == movieId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Showtime>> GetByRoomIdAsync(int roomId)
    {
        return await _context.Showtimes
            .Where(s => s.RoomId == roomId)
            .ToListAsync();
    }

    public async Task<Showtime?> GetByIdAsync(int id)
    {
        return await _context.Showtimes.FindAsync(id);
    }

    public async Task<bool> IsRoomAvailableAsync(int roomId, DateTime startTime)
    {
        // Assuming showtime duration is 2 hours, check if room is free
        var endTime = startTime.AddHours(2);
        return !await _context.Showtimes
            .AnyAsync(s => s.RoomId == roomId &&
                          ((s.Started <= startTime && s.Started.AddHours(2) > startTime) ||
                           (s.Started < endTime && s.Started.AddHours(2) >= endTime)));
    }

    public async Task AddAsync(Showtime showtime)
    {
        await _context.Showtimes.AddAsync(showtime);
    }

    public async Task UpdateAsync(Showtime showtime)
    {
        _context.Showtimes.Update(showtime);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Showtime showtime)
    {
        _context.Showtimes.Remove(showtime);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}