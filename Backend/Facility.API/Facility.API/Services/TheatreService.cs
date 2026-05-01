using Facility.API.DTOs.Requests;
using Facility.API.DTOs.Responses;
using Facility.API.Models;
using Facility.API.Repositories;

namespace Facility.API.Services;

public class TheatreService : ITheatreService
{
    private readonly ITheatreRepository _theatreRepository;

    public TheatreService(ITheatreRepository theatreRepository)
    {
        _theatreRepository = theatreRepository;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<TheatreResponseDto>> GetAllTheatresAsync()
    {
        var theatres = await _theatreRepository.GetAllAsync();
        return theatres.Select(MapToResponseDto);
    }

    /// <inheritdoc />
    public async Task<TheatreResponseDto?> GetTheatreByIdAsync(int id)
    {
        var theatre = await _theatreRepository.GetByIdAsync(id);
        return theatre is null ? null : MapToResponseDto(theatre);
    }

    /// <inheritdoc />
    public async Task<TheatreResponseDto> CreateTheatreAsync(TheatreRequestDto dto)
    {
        var theatre = new Theatre
        {
            TheatreName   = dto.TheatreName,
            Location      = dto.Location,
            Coordinates   = dto.Coordinates,
            PreviewUrl    = dto.PreviewUrl ?? string.Empty,
            Info          = dto.Info ?? string.Empty,
            TheatreStatus = "Active",
            City          = dto.City ?? string.Empty
        };

        await _theatreRepository.AddAsync(theatre);
        await _theatreRepository.SaveChangesAsync();

        return MapToResponseDto(theatre);
    }

    /// <inheritdoc />
    public async Task<TheatreResponseDto?> UpdateTheatreAsync(int id, TheatreRequestDto dto)
    {
        var theatre = await _theatreRepository.GetByIdAsync(id);
        if (theatre is null) return null;

        theatre.TheatreName = dto.TheatreName;
        theatre.Location    = dto.Location;
        theatre.Coordinates = dto.Coordinates;

        // Chỉ cập nhật nếu client gửi lên
        if (dto.PreviewUrl is not null) theatre.PreviewUrl = dto.PreviewUrl;
        if (dto.Info is not null) theatre.Info = dto.Info;
        if (dto.City is not null) theatre.City = dto.City;

        await _theatreRepository.UpdateAsync(theatre);
        await _theatreRepository.SaveChangesAsync();

        return MapToResponseDto(theatre);
    }

    // ── Helper ────────────────────────────────────────────────
    private static TheatreResponseDto MapToResponseDto(Theatre theatre)
    {
        return new TheatreResponseDto
        {
            TheatreId     = theatre.TheatreId,
            TheatreName   = theatre.TheatreName,
            Location      = theatre.Location,
            Coordinates   = theatre.Coordinates,
            PreviewUrl    = theatre.PreviewUrl,
            Info          = theatre.Info,
            TheatreStatus = theatre.TheatreStatus,
            City          = theatre.City
        };
    }
}