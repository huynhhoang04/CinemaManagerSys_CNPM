using Microsoft.EntityFrameworkCore;
using Booking.API.Models;

namespace Booking.API.Data;

public class BookingDbContext : DbContext
{
    public BookingDbContext(DbContextOptions<BookingDbContext> options) : base(options) { }

    public DbSet<Models.Booking> Bookings { get; set; }
    public DbSet<Ticket> Tickets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ticket>()
            .HasIndex(t => new { t.ShowtimeId, t.SeatNumber })
            .IsUnique();
    }
}