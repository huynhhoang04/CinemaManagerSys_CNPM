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

    private DateTime _releaseDate;
    [Column("release_date")]
    public DateTime ReleaseDate 
    { 
        get => _releaseDate; 
        set => _releaseDate = value.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(value, DateTimeKind.Utc) : value.ToUniversalTime(); 
    }

    [MaxLength(100)]
    [Column("movie_status")]
    public string MovieStatus { get; set; } = string.Empty;

    public ICollection<MovieGenre> MovieGenres { get; set; } = [];
}