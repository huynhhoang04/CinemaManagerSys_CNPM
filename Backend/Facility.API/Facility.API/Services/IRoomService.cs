using Facility.API.DTOs.Requests;
using Facility.API.DTOs.Responses;

namespace Facility.API.Services;

public interface IRoomService
{
    Task<IEnumerable<RoomResponseDto>> GetRoomsByTheatreIdAsync(int theatreId);
    Task<RoomResponseDto?> GetRoomByIdAsync(int id);
    Task<RoomResponseDto> CreateRoomAsync(RoomRequestDto dto);
    Task<RoomResponseDto?> UpdateRoomAsync(int id, RoomRequestDto dto);
}