using Facility.API.DTOs.Requests;
using Facility.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Facility.API.Controllers;

/// <summary>
/// Theatre Controller – Quản lý cụm rạp chiếu phim.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TheatreController : ControllerBase
{
    private readonly ITheatreService _theatreService;

    public TheatreController(ITheatreService theatreService)
    {
        _theatreService = theatreService;
    }

    /// <summary>
    /// GET /api/theatre
    /// Lấy danh sách toàn bộ cụm rạp để người dùng chọn.
    /// Yêu cầu quyền: Public (không cần đăng nhập).
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var theatres = await _theatreService.GetAllTheatresAsync();
        return Ok(theatres);
    }

    /// <summary>
    /// GET /api/theatre/{id}
    /// Xem chi tiết thông tin, vị trí của rạp.
    /// Yêu cầu quyền: Public (không cần đăng nhập).
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var theatre = await _theatreService.GetTheatreByIdAsync(id);
        if (theatre is null)
            return NotFound(new { message = $"Không tìm thấy rạp với ID {id}." });
        return Ok(theatre);
    }

    /// <summary>
    /// POST /api/theatre
    /// Thêm chi nhánh rạp mới.
    /// Payload gửi lên: Tên, Vị trí, Tọa độ.
    /// Yêu cầu quyền: Admin.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] TheatreRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var theatre = await _theatreService.CreateTheatreAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = theatre.TheatreId }, theatre);
    }

    /// <summary>
    /// PUT /api/theatre/{id}
    /// Sửa thông tin rạp.
    /// Payload gửi lên: Tên, Vị trí, Tọa độ.
    /// Yêu cầu quyền: Admin.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update(int id, [FromBody] TheatreRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var theatre = await _theatreService.UpdateTheatreAsync(id, dto);
        if (theatre is null)
            return NotFound(new { message = $"Không tìm thấy rạp với ID {id}." });
        return Ok(theatre);
    }
}