using Booking.API.Repositories;
using Booking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Booking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class TicketController : ControllerBase
{
    private readonly ITicketRepository _ticketRepository;

    public TicketController(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    [HttpGet("showtime/{showtimeId}")]
    public async Task<IActionResult> GetSoldSeats(int showtimeId)
    {
        var tickets = await _ticketRepository.GetByShowtimeIdAsync(showtimeId);
        var seats = tickets.Select(t => t.SeatNumber);
        return Ok(seats);
    }
}