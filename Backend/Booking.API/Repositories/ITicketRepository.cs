using Booking.API.Models;

namespace Booking.API.Repositories;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetByBookingIdAsync(int bookingId);
    Task<IEnumerable<Ticket>> GetByShowtimeIdAsync(int showtimeId);
    Task AddRangeAsync(IEnumerable<Ticket> tickets);
    Task SaveChangesAsync();
}