using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Booking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TicketController : ControllerBase
{
    [HttpGet("showtime/{showtimeId}")]
    public async Task<IActionResult> GetSoldSeats(int showtimeId) => throw new NotImplementedException();
}