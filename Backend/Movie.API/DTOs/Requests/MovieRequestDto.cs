using System.ComponentModel.DataAnnotations;

namespace Movie.API.DTOs.Requests;

public class MovieRequestDto
{
    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [MaxLength(255)]
    public string PosterUrl { get; set; } = string.Empty;

    [MaxLength(255)]
    public string TrailerUrl { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Duration must be greater than 0.")]
    public int Duration { get; set; }

    public DateTime ReleaseDate { get; set; }

    [MaxLength(100)]
    public string MovieStatus { get; set; } = string.Empty;

    /// <summary>
    /// Danh sách Genre ID gán cho phim (có thể rỗng)
    /// </summary>
    public List<int> GenreIds { get; set; } = [];
}