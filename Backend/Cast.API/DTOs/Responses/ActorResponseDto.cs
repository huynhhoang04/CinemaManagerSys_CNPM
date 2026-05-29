namespace Cast.API.DTOs.Responses;

public class ActorResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
}

public class MovieActorResponseDto : ActorResponseDto
{
    public string CharacterName { get; set; } = string.Empty;
}