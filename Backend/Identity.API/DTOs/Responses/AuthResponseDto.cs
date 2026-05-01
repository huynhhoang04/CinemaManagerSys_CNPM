namespace Identity.API.DTOs.Responses;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Fullname { get; set; } = string.Empty;
}