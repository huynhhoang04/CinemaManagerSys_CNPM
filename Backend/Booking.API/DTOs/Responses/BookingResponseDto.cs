namespace Booking.API.DTOs.Responses;

public class BookingResponseDto
{
    public int BookingId { get; set; }

    public int UserId { get; set; }

    public DateTime BookingDate { get; set; }

    public decimal TotalPayment { get; set; }

    public string PaymentStatus { get; set; } = string.Empty;

    public string PaymentMethod { get; set; } = string.Empty;

    public List<TicketResponseDto> Tickets { get; set; } = new();
}