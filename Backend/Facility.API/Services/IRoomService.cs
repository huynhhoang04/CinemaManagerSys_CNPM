namespace Facility.API.Services;

public interface IRoomService
{
    Task GetRoomsByTheatreIdAsync(int theatreId);
    Task CreateRoomAsync(); // Bắt buộc DTO gửi lên phải có TheatreId
    Task UpdateRoomAsync(int id);
}