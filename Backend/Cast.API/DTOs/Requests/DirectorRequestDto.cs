using System.ComponentModel.DataAnnotations;

namespace Cast.API.DTOs.Requests;

public class DirectorRequestDto
{
    [Required(ErrorMessage = "Tên đạo diễn không được để trống")]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(255)]
    [Url(ErrorMessage = "Avatar phải là một URL hợp lệ")]
    public string Avatar { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;
}