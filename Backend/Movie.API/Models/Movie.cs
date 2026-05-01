using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Movie.API.Models;

[Table("movies")]
public class Movie
{
    [Key]
    [Column("movie_id")]
    public int MovieId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("poster_url")]
    public string PosterUrl { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("trailer_url")]
    public string TrailerUrl { get; set; } = string.Empty;

    [Column("duration")]
    public int Duration { get; set; }

    [Column("release_date")]
    public DateTime ReleaseDate { get; set; }

    [MaxLength(100)]
    [Column("movie_status")]
    public string MovieStatus { get; set; } = string.Empty;

    // Navigation property
    public ICollection<MovieGenre> MovieGenres { get; set; } = [];
}