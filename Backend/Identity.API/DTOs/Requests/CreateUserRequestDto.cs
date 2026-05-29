using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Identity.API.DTOs.Requests;

public class CreateUserRequestDto
{
    [JsonPropertyName("username")]
    [Required(ErrorMessage = "Username là bắt buộc")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    [Required(ErrorMessage = "Password là bắt buộc")]
    [MinLength(6, ErrorMessage = "Password phải có ít nhất 6 ký tự")]
    public string Password { get; set; } = string.Empty;

    [JsonPropertyName("fullname")]
    [Required(ErrorMessage = "Fullname là bắt buộc")]
    public string Fullname { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
    [JsonPropertyName("role")]
    [Required(ErrorMessage = "Role là bắt buộc")]
    [RegularExpression("^(Admin|Staff)$", ErrorMessage = "Role chỉ được là Admin hoặc Staff")]
    public string Role { get; set; } = string.Empty;
}