using Cast.API.DTOs.Requests;
using Cast.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cast.API.Controllers;

[ApiController]
[Route("api/cast/directors")]
public class DirectorController : ControllerBase
{
    private readonly IDirectorService _service;

    public DirectorController(IDirectorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var directors = await _service.GetAllAsync();
        return Ok(directors);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] DirectorRequestDto dto)
    {
        await _service.CreateAsync(dto);
        return StatusCode(201, new { message = "Director created successfully" });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] DirectorRequestDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return Ok(new { message = "Director updated successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "Director deleted successfully" });
    }

    [HttpGet("movie/{movieId}")]
    public async Task<IActionResult> GetByMovieId(int movieId)
    {
        var directors = await _service.GetByMovieIdAsync(movieId);
        return Ok(directors);
    }

    [HttpPost("movie/{movieId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignToMovie(int movieId, [FromBody] IEnumerable<int> directorIds)
    {
        await _service.AssignToMovieAsync(movieId, directorIds);
        return Ok(new { message = "Directors assigned to movie successfully" });
    }
}