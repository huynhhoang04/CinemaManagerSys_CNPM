using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Facility.API.Models;

[Table("room")]
public class Room
{
    [Key]
    [Column("room_id")]
    public int RoomId { get; set; }

    [Column("theatre_id")]
    public int TheatreId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("room_name")]
    public string RoomName { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("room_type")]
    public string RoomType { get; set; } = string.Empty;

    [Column("capacity")]
    public int Capacity { get; set; }

    [MaxLength(100)]
    [Column("room_status")]
    public string RoomStatus { get; set; } = string.Empty;
}