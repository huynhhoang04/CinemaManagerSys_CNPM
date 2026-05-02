using Booking.API.Models;

namespace Booking.API.Repositories;

public class BookingRepository : IBookingRepository
{
    public Task<Models.Booking?> GetByIdAsync(int id) => throw new NotImplementedException();
    public Task<IEnumerable<Models.Booking>> GetByUserIdAsync(int userId) => throw new NotImplementedException();
    public Task AddAsync(Models.Booking booking) => throw new NotImplementedException();
    public Task SaveChangesAsync() => throw new NotImplementedException();
}