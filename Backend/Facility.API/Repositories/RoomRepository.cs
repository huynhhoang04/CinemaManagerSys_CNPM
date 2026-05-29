using Facility.API.Data;
using Facility.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Facility.API.Repositories;

public class RoomRepository : IRoomRepository
{
    private readonly FacilityDbContext _context;

    public RoomRepository(FacilityDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Room>> GetRoomsByTheatreIdAsync(int theatreId)
    {
        return await _context.Rooms
            .AsNoTracking()
            .Where(r => r.TheatreId == theatreId)
            .ToListAsync();
    }

    public async Task<Room?> GetByIdAsync(int id)
    {
        return await _context.Rooms.FindAsync(id);
    }

    public async Task AddAsync(Room room)
    {
        await _context.Rooms.AddAsync(room);
    }

    public Task UpdateAsync(Room room)
    {
        _context.Rooms.Update(room);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}