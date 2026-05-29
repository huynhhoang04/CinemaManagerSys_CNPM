namespace Booking.API.DTOs.Requests;

public class CreateBookingRequestDto
{
    public int UserId { get; set; }

    public int ShowtimeId { get; set; }

    public List<string> SeatNumbers { get; set; } = new();

    public decimal Total { get; set; }

    public string PaymentMethod { get; set; } = "Cash";
}