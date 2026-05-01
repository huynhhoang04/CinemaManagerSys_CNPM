using System.ComponentModel.DataAnnotations;

namespace Identity.API.DTOs.Requests;

public class UpdateUserRequestDto
{
    [Required(ErrorMessage = "Fullname là bắt buộc")]
    public string Fullname { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;
}