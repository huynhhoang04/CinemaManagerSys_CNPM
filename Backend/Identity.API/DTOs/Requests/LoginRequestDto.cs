using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Identity.API.DTOs.Requests;

public class LoginRequestDto
{
    [JsonPropertyName("username")]
    [Required(ErrorMessage = "Username là bắt buộc")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    [Required(ErrorMessage = "Password là bắt buộc")]
    public string Password { get; set; } = string.Empty;
}