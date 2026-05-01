using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cast.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActorController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => throw new NotImplementedException();

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create() => throw new NotImplementedException();

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id) => throw new NotImplementedException();

    [HttpGet("movie/{movieId}")]
    public async Task<IActionResult> GetByMovieId(int movieId) => throw new NotImplementedException();

    [HttpPost("movie/{movieId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignToMovie(int movieId) => throw new NotImplementedException();
}