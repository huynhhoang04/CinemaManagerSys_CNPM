using Booking.API.Data;
using Booking.API.DTOs.Requests;
using Booking.API.DTOs.Responses;
using Booking.API.Models;
using Booking.API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Booking.API.Services;

public class BookingService : IBookingService
{
    private readonly BookingDbContext _context;
    private readonly IBookingRepository _bookingRepository;
    private readonly ITicketRepository _ticketRepository;

    public BookingService(
        BookingDbContext context,
        IBookingRepository bookingRepository,
        ITicketRepository ticketRepository)
    {
        _context = context;
        _bookingRepository = bookingRepository;
        _ticketRepository = ticketRepository;
    }

    public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request)
    {
        if (request.SeatNumbers == null || request.SeatNumbers.Count == 0)
        {
            throw new Exception("Danh sách ghế không được để trống.");
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Kiểm tra xem có ghế nào đã được đặt chưa
            var existingSeats = await _context.Tickets
                .Where(t => t.ShowtimeId == request.ShowtimeId && request.SeatNumbers.Contains(t.SeatNumber))
                .Select(t => t.SeatNumber)
                .ToListAsync();

            if (existingSeats.Any())
            {
                throw new Exception($"Các ghế sau đã được đặt: {string.Join(", ", existingSeats)}");
            }

            var booking = new Models.Booking
            {
                UserId = request.UserId,
                BookingDate = DateTime.UtcNow,
                TotalPayment = request.Total,
                PaymentStatus = "Completed",
                PaymentMethod = request.PaymentMethod
            };

            await _bookingRepository.AddAsync(booking);
            await _bookingRepository.SaveChangesAsync();

            var tickets = request.SeatNumbers.Select(seat => new Ticket
            {
                BookingId = booking.BookingId,
                ShowtimeId = request.ShowtimeId,
                SeatNumber = seat
            }).ToList();

            await _ticketRepository.AddRangeAsync(tickets);
            await _ticketRepository.SaveChangesAsync();

            await transaction.CommitAsync();

            return MapToResponse(booking, tickets);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<BookingResponseDto?> GetBookingByIdAsync(int id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);

        if (booking == null)
        {
            return null;
        }

        var tickets = await _ticketRepository.GetByBookingIdAsync(booking.BookingId);

        return MapToResponse(booking, tickets);
    }

    public async Task<IEnumerable<BookingResponseDto>> GetBookingsByUserAsync(int userId)
    {
        var bookings = await _bookingRepository.GetByUserIdAsync(userId);

        var result = new List<BookingResponseDto>();

        foreach (var booking in bookings)
        {
            var tickets = await _ticketRepository.GetByBookingIdAsync(booking.BookingId);
            result.Add(MapToResponse(booking, tickets));
        }

        return result;
    }

    private BookingResponseDto MapToResponse(Models.Booking booking, IEnumerable<Ticket> tickets)
    {
        return new BookingResponseDto
        {
            BookingId = booking.BookingId,
            UserId = booking.UserId,
            BookingDate = booking.BookingDate,
            TotalPayment = booking.TotalPayment,
            PaymentStatus = booking.PaymentStatus,
            PaymentMethod = booking.PaymentMethod,
            Tickets = tickets.Select(t => new TicketResponseDto
            {
                TicketId = t.TicketId,
                BookingId = t.BookingId,
                ShowtimeId = t.ShowtimeId,
                SeatNumber = t.SeatNumber
            }).ToList()
        };
    }
}