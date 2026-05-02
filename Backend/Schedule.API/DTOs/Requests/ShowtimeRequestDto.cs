// File: DTOs/Requests/ShowtimeRequestDto.cs
namespace Schedule.API.DTOs.Requests;

public class ShowtimeRequestDto
{
    public int MovieId { get; set; }
    public int RoomId { get; set; }
    public DateTime Started { get; set; }
    public decimal Price { get; set; }
}