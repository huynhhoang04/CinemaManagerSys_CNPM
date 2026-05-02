using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Schedule.API.DTOs.Requests;
using Schedule.API.DTOs.Responses;
using Schedule.API.Services;

namespace Schedule.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShowtimeController : ControllerBase
{
    private readonly IShowtimeService _service;

    public ShowtimeController(IShowtimeService service)
    {
        _service = service;
    }

    [HttpGet("movie/{movieId}")]
    public async Task<IActionResult> GetByMovieId(int movieId)
    {
        var showtimes = await _service.GetShowtimesByMovieIdAsync(movieId);
        return Ok(showtimes);
    }

    [HttpGet("room/{roomId}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> GetByRoomId(int roomId)
    {
        var showtimes = await _service.GetShowtimesByRoomIdAsync(roomId);
        return Ok(showtimes);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] ShowtimeRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _service.CreateShowtimeAsync(request);
        if (result == null)
        {
            return Conflict("Room is not available at the specified time.");
        }

        return CreatedAtAction(nameof(GetByMovieId), new { movieId = result.MovieId }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] ShowtimeRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _service.UpdateShowtimeAsync(id, request);
        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteShowtimeAsync(id);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}