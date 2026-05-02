using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Booking.API.Models;

[Table("bookings")]
public class Booking
{
    [Key]
    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("booking_date")]
    public DateTime BookingDate { get; set; }

    [Column("total_payment", TypeName = "numeric(10,2)")]
    public decimal TotalPayment { get; set; }

    [MaxLength(50)]
    [Column("payment_status")]
    public string PaymentStatus { get; set; } = string.Empty;

    [MaxLength(50)]
    [Column("payment_method")]
    public string PaymentMethod { get; set; } = string.Empty;
}