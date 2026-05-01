using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast.API.Models;

[Table("actors")]
public class Actor
{
    [Key]
    [Column("actor_id")]
    public int ActorId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("actor_name")]
    public string ActorName { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("avatar_url")]
    public string AvatarUrl { get; set; } = string.Empty;

    [Column("bio")]
    public string Bio { get; set; } = string.Empty;
}