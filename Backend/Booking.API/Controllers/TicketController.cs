using Booking.API.Repositories;
using Booking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Booking.API.Controllers;

[ApiController]
[Route("/api/booking/tickets")]
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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ticket = await _ticketRepository.GetByIdAsync(id);
        if (ticket == null) return NotFound(new { message = "Không tìm thấy vé." });
        return Ok(ticket);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ticket = await _ticketRepository.GetByIdAsync(id);
        if (ticket == null) return NotFound(new { message = "Không tìm thấy vé." });

        await _ticketRepository.DeleteAsync(ticket);
        await _ticketRepository.SaveChangesAsync();
        return Ok(new { message = "Hoàn vé thành công." });
    }
}