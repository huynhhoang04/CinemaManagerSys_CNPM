using Booking.API.DTOs.Requests;
using Booking.API.DTOs.Responses;

namespace Booking.API.Services;

public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request);

    Task<BookingResponseDto?> GetBookingByIdAsync(int id);

    Task<IEnumerable<BookingResponseDto>> GetBookingsByUserAsync(int userId);
}