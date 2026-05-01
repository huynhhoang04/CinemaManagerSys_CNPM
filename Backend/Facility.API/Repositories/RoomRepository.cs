using Facility.API.Models;

namespace Facility.API.Repositories;

public class RoomRepository : IRoomRepository
{
    public Task<IEnumerable<Room>> GetRoomsByTheatreIdAsync(int theatreId) => throw new NotImplementedException();
    public Task<Room?> GetByIdAsync(int id) => throw new NotImplementedException();
    public Task AddAsync(Room room) => throw new NotImplementedException();
    public Task UpdateAsync(Room room) => throw new NotImplementedException();
    public Task SaveChangesAsync() => throw new NotImplementedException();
}