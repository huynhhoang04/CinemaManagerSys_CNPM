using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cast.API.Models;

[Table("movie_actor")]
public class MovieActor
{
    [Column("movie_id")]
    public int MovieId { get; set; } 

    [Column("actor_id")]
    public int ActorId { get; set; }

    [MaxLength(255)]
    [Column("character_name")]
    public string CharacterName { get; set; } = string.Empty;
}