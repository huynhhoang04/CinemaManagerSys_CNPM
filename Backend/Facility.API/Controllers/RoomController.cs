using Facility.API.DTOs.Requests;
using Facility.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Facility.API.Controllers;

/// <summary>
/// Room Controller – Quản lý phòng chiếu trong cụm rạp.
/// </summary>
[ApiController]
[Route("api/facility/rooms")]
public class RoomController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    /// <summary>
    /// Lấy danh sách phòng chiếu theo rạp.
    /// </summary>
    [HttpGet("theatre/{theatreId}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByTheatreId(int theatreId)
    {
        var rooms = await _roomService.GetRoomsByTheatreIdAsync(theatreId);
        return Ok(rooms);
    }

    /// <summary>
    /// Lấy chi tiết phòng chiếu theo ID.
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var room = await _roomService.GetRoomByIdAsync(id);
        if (room is null)
            return NotFound(new { message = $"Không tìm thấy phòng chiếu với ID {id}." });
        return Ok(room);
    }

    /// <summary>
    /// Thêm phòng chiếu mới (Admin only).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] RoomRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var room = await _roomService.CreateRoomAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = room.RoomId }, room);
    }

    /// <summary>
    /// Cập nhật phòng chiếu (Admin only).
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update(int id, [FromBody] RoomRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var room = await _roomService.UpdateRoomAsync(id, dto);
        if (room is null)
            return NotFound(new { message = $"Không tìm thấy phòng chiếu với ID {id}." });
        return Ok(room);
    }
}