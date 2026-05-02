using Booking.API.Models;

namespace Booking.API.Repositories;

public interface IBookingRepository
{
    Task<Models.Booking?> GetByIdAsync(int id);
    Task<IEnumerable<Models.Booking>> GetByUserIdAsync(int userId);
    Task AddAsync(Models.Booking booking);
    Task SaveChangesAsync();
}