using Facility.API.DTOs.Requests;
using Facility.API.DTOs.Responses;

namespace Facility.API.Services;

public interface ITheatreService
{
    Task<IEnumerable<TheatreResponseDto>> GetAllTheatresAsync();
    Task<TheatreResponseDto?> GetTheatreByIdAsync(int id);
    Task<TheatreResponseDto> CreateTheatreAsync(TheatreRequestDto dto);
    Task<TheatreResponseDto?> UpdateTheatreAsync(int id, TheatreRequestDto dto);
}