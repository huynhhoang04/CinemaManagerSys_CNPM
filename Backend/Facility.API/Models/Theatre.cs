using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Facility.API.Models;

[Table("theatres")]
public class Theatre
{
    [Key]
    [Column("theatre_id")]
    public int TheatreId { get; set; }

    /// <summary>Tên rạp (cụm rạp)</summary>
    [Required]
    [MaxLength(150)]
    [Column("theatre_name")]
    public string TheatreName { get; set; } = string.Empty;

    /// <summary>Vị trí / địa chỉ rạp</summary>
    [MaxLength(255)]
    [Column("location")]
    public string Location { get; set; } = string.Empty;

    /// <summary>Tọa độ GPS (lat,lng)</summary>
    [MaxLength(100)]
    [Column("coordinates")]
    public string Coordinates { get; set; } = string.Empty;

    /// <summary>Ảnh đại diện rạp</summary>
    [MaxLength(500)]
    [Column("preview_url")]
    public string PreviewUrl { get; set; } = string.Empty;

    /// <summary>Mô tả / thông tin chi tiết</summary>
    [Column("info")]
    public string Info { get; set; } = string.Empty;

    /// <summary>Trạng thái: Active / Inactive</summary>
    [MaxLength(50)]
    [Column("theatre_status")]
    public string TheatreStatus { get; set; } = "Active";

    /// <summary>Thành phố</summary>
    [MaxLength(100)]
    [Column("city")]
    public string City { get; set; } = string.Empty;

    // ── Navigation ──
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
}