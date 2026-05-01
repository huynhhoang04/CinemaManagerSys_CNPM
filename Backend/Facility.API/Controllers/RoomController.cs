using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Facility.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomController : ControllerBase
{
    [HttpGet("theatre/{theatreId}")]
    public async Task<IActionResult> GetByTheatreId(int theatreId) => throw new NotImplementedException();

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create() => throw new NotImplementedException();

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id) => throw new NotImplementedException();
}