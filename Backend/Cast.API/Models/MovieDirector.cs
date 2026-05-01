using System.ComponentModel.DataAnnotations.Schema;

namespace Cast.API.Models;

[Table("movie_director")]
public class MovieDirector
{
    [Column("movie_id")]
    public int MovieId { get; set; } 

    [Column("director_id")]
    public int DirectorId { get; set; }
}