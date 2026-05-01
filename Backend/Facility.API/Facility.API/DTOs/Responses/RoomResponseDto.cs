namespace Facility.API.DTOs.Responses;

public class RoomResponseDto
{
    public int RoomId { get; set; }
    public int TheatreId { get; set; }
    public string RoomName { get; set; } = string.Empty;
    public string RoomType { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string RoomStatus { get; set; } = string.Empty;
}