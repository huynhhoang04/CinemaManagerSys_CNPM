using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Facility.API.Models;

[Table("rooms")]
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

    /// <summary>Loại phòng: 2D / 3D / IMAX / 4DX</summary>
    [MaxLength(50)]
    [Column("room_type")]
    public string RoomType { get; set; } = string.Empty;

    [Column("capacity")]
    public int Capacity { get; set; }

    /// <summary>Trạng thái: Active / Maintenance / Inactive</summary>
    [MaxLength(50)]
    [Column("room_status")]
    public string RoomStatus { get; set; } = "Active";

    // ── Navigation ──
    [ForeignKey(nameof(TheatreId))]
    public Theatre? Theatre { get; set; }
}