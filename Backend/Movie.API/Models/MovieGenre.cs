using System.ComponentModel.DataAnnotations.Schema;

namespace Movie.API.Models;

[Table("movie_genre")]
public class MovieGenre
{
    [Column("movie_id")]
    public int MovieId { get; set; }

    [Column("genre_id")]
    public int GenreId { get; set; }

    // Navigation properties
    public Movie Movie { get; set; } = null!;
    public Genre Genre { get; set; } = null!;
}