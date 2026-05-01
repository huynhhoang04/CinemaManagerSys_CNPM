using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Facility.API.Models;

[Table("theatres")]
public class Theatre
{
    [Key]
    [Column("theatre_id")]
    public int TheatreId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("theatre_name")]
    public string TheatreName { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("location")]
    public string Location { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("preview_url")]
    public string PreviewUrl { get; set; } = string.Empty;

    [Column("info")]
    public string Info { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("theatre_status")]
    public string TheatreStatus { get; set; } = string.Empty;

    [MaxLength(50)]
    [Column("city")]
    public string City { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("coordinates")]
    public string Coordinates { get; set; } = string.Empty;
}