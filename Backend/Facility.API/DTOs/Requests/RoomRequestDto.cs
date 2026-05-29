using System.ComponentModel.DataAnnotations;

namespace Facility.API.DTOs.Requests;

public class RoomRequestDto
{
    [Required(ErrorMessage = "Theatre ID is required.")]
    public int TheatreId { get; set; }

    [Required(ErrorMessage = "Room name is required.")]
    [MaxLength(100)]
    public string RoomName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string RoomType { get; set; } = string.Empty;

    [Range(1, 10000, ErrorMessage = "Capacity must be between 1 and 10000.")]
    public int Capacity { get; set; }

    [MaxLength(100)]
    public string RoomStatus { get; set; } = "Active";
}