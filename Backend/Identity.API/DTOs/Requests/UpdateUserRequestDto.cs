using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Identity.API.DTOs.Requests;

public class UpdateUserRequestDto
{
    [JsonPropertyName("fullname")]
    [Required(ErrorMessage = "Fullname là bắt buộc")]
    public string Fullname { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
}