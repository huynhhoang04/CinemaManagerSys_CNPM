using Booking.API.Data;
using Booking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Booking.API.Repositories;

public class TicketRepository : ITicketRepository
{
    private readonly BookingDbContext _context;

    public TicketRepository(BookingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ticket>> GetByBookingIdAsync(int bookingId)
    {
        return await _context.Tickets
            .Where(t => t.BookingId == bookingId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetByShowtimeIdAsync(int showtimeId)
    {
        return await _context.Tickets
            .Where(t => t.ShowtimeId == showtimeId)
            .ToListAsync();
    }

    public async Task<Ticket?> GetByIdAsync(int id)
    {
        return await _context.Tickets.FindAsync(id);
    }

    public async Task DeleteAsync(Ticket ticket)
    {
        _context.Tickets.Remove(ticket);
        await Task.CompletedTask;
    }

    public async Task AddRangeAsync(IEnumerable<Ticket> tickets)
    {
        await _context.Tickets.AddRangeAsync(tickets);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}