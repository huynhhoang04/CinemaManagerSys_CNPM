using Facility.API.DTOs.Requests;
using Facility.API.DTOs.Responses;
using Facility.API.Models;
using Facility.API.Repositories;

namespace Facility.API.Services;

public class RoomService : IRoomService
{
    private readonly IRoomRepository _roomRepository;

    public RoomService(IRoomRepository roomRepository)
    {
        _roomRepository = roomRepository;
    }

    public async Task<IEnumerable<RoomResponseDto>> GetRoomsByTheatreIdAsync(int theatreId)
    {
        var rooms = await _roomRepository.GetRoomsByTheatreIdAsync(theatreId);
        return rooms.Select(MapToResponseDto);
    }

    public async Task<RoomResponseDto?> GetRoomByIdAsync(int id)
    {
        var room = await _roomRepository.GetByIdAsync(id);
        return room is null ? null : MapToResponseDto(room);
    }

    public async Task<RoomResponseDto> CreateRoomAsync(RoomRequestDto dto)
    {
        var room = new Room
        {
            TheatreId = dto.TheatreId,
            RoomName = dto.RoomName,
            RoomType = dto.RoomType,
            Capacity = dto.Capacity,
            RoomStatus = dto.RoomStatus
        };

        await _roomRepository.AddAsync(room);
        await _roomRepository.SaveChangesAsync();

        return MapToResponseDto(room);
    }

    public async Task<RoomResponseDto?> UpdateRoomAsync(int id, RoomRequestDto dto)
    {
        var room = await _roomRepository.GetByIdAsync(id);
        if (room is null) return null;

        room.TheatreId = dto.TheatreId;
        room.RoomName = dto.RoomName;
        room.RoomType = dto.RoomType;
        room.Capacity = dto.Capacity;
        room.RoomStatus = dto.RoomStatus;

        await _roomRepository.UpdateAsync(room);
        await _roomRepository.SaveChangesAsync();

        return MapToResponseDto(room);
    }

    private static RoomResponseDto MapToResponseDto(Room room)
    {
        return new RoomResponseDto
        {
            RoomId = room.RoomId,
            TheatreId = room.TheatreId,
            RoomName = room.RoomName,
            RoomType = room.RoomType,
            Capacity = room.Capacity,
            RoomStatus = room.RoomStatus
        };
    }
}