using Booking.API.Models;

namespace Booking.API.Repositories;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetByBookingIdAsync(int bookingId);
    Task<IEnumerable<Ticket>> GetByShowtimeIdAsync(int showtimeId);
    Task<Ticket?> GetByIdAsync(int id);
    Task DeleteAsync(Ticket ticket);
    Task AddRangeAsync(IEnumerable<Ticket> tickets);
    Task SaveChangesAsync();
}