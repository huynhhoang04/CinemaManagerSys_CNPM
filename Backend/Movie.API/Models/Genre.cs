using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Movie.API.Models;

[Table("genres")]
public class Genre
{
    [Key]
    [Column("genre_id")]
    public int GenreId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("genre_name")]
    public string GenreName { get; set; } = string.Empty;
}