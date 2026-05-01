using Facility.API.Models;

namespace Facility.API.Repositories;

public interface IRoomRepository
{
    Task<IEnumerable<Room>> GetRoomsByTheatreIdAsync(int theatreId);
    Task<Room?> GetByIdAsync(int id);
    Task AddAsync(Room room);
    Task UpdateAsync(Room room);
    Task SaveChangesAsync();
}