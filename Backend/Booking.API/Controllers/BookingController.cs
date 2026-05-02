using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Booking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create() => throw new NotImplementedException();

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) => throw new NotImplementedException();

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(int userId) => throw new NotImplementedException();
}