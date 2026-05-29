// File: DTOs/Responses/ShowtimeResponseDto.cs
namespace Schedule.API.DTOs.Responses;

public class ShowtimeResponseDto
{
    public int ShowtimeId { get; set; }
    public int MovieId { get; set; }
    public int RoomId { get; set; }
    public DateTime Started { get; set; }
    public decimal Price { get; set; }
}