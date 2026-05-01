using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Booking.API.Models;

[Table("tickets")]
public class Ticket
{
    [Key]
    [Column("ticket_id")]
    public int TicketId { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("showtime_id")]
    public int ShowtimeId { get; set; }

    [MaxLength(10)]
    [Column("seat_number")]
    public string SeatNumber { get; set; } = string.Empty;
}