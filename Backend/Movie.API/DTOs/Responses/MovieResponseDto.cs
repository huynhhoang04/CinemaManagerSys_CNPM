namespace Movie.API.DTOs.Responses;

public class MovieResponseDto
{
    public int MovieId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    public string TrailerUrl { get; set; } = string.Empty;
    public int Duration { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string MovieStatus { get; set; } = string.Empty;

    /// <summary>
    /// Danh sách thể loại phim
    /// </summary>
    public List<GenreResponseDto> Genres { get; set; } = [];
}