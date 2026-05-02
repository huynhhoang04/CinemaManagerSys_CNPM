using Booking.API.Models;

namespace Booking.API.Repositories;

public class TicketRepository : ITicketRepository
{
    public Task<IEnumerable<Ticket>> GetByBookingIdAsync(int bookingId) => throw new NotImplementedException();
    public Task<IEnumerable<Ticket>> GetByShowtimeIdAsync(int showtimeId) => throw new NotImplementedException();
    public Task AddRangeAsync(IEnumerable<Ticket> tickets) => throw new NotImplementedException();
    public Task SaveChangesAsync() => throw new NotImplementedException();
}