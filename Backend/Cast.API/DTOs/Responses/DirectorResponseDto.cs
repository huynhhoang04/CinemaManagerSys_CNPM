namespace Cast.API.DTOs.Responses;

public class DirectorResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
}