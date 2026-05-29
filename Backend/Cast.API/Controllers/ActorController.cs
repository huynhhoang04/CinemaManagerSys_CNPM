using Cast.API.DTOs.Requests;
using Cast.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cast.API.Controllers;

[ApiController]
[Route("api/cast/actors")]
public class ActorController : ControllerBase
{
    private readonly IActorService _service;

    public ActorController(IActorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var actors = await _service.GetAllAsync();
        return Ok(actors);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] ActorRequestDto dto)
    {
        await _service.CreateAsync(dto);
        return StatusCode(201, new { message = "Actor created successfully" });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] ActorRequestDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return Ok(new { message = "Actor updated successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "Actor deleted successfully" });
    }

    [HttpGet("movie/{movieId}")]
    public async Task<IActionResult> GetByMovieId(int movieId)
    {
        var actors = await _service.GetByMovieIdAsync(movieId);
        return Ok(actors);
    }

    [HttpPost("movie/{movieId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignToMovie(int movieId, [FromBody] IEnumerable<MovieActorMapDto> actorMaps)
    {
        await _service.AssignToMovieAsync(movieId, actorMaps);
        return Ok(new { message = "Actors assigned to movie successfully" });
    }
}