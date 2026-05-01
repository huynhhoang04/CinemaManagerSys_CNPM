using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast.API.Models;

[Table("directors")]
public class Director
{
    [Key]
    [Column("director_id")]
    public int DirectorId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("director_name")]
    public string DirectorName { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("avatar_url")]
    public string AvatarUrl { get; set; } = string.Empty;

    [Column("bio")]
    public string Bio { get; set; } = string.Empty;
}