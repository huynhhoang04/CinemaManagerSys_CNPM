namespace Booking.API.Services;

public interface IBookingService
{
    Task CreateBookingAsync();
    Task GetBookingByIdAsync(int id);
    Task GetBookingsByUserAsync(int userId);
    Task GetSoldSeatsByShowtimeAsync(int showtimeId);
}