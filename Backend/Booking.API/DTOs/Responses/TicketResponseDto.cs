namespace Booking.API.DTOs.Responses;

public class TicketResponseDto
{
    public int TicketId { get; set; }

    public int BookingId { get; set; }

    public int ShowtimeId { get; set; }

    public string SeatNumber { get; set; } = string.Empty;
}