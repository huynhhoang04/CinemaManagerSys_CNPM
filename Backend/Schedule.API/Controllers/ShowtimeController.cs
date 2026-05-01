using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Schedule.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShowtimeController : ControllerBase
{
    [HttpGet("movie/{movieId}")]
    public async Task<IActionResult> GetByMovieId(int movieId) => throw new NotImplementedException();

    [HttpGet("room/{roomId}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> GetByRoomId(int roomId) => throw new NotImplementedException();

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create() => throw new NotImplementedException();

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id) => throw new NotImplementedException();

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) => throw new NotImplementedException();
}