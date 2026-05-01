namespace Facility.API.Services;

public interface ITheatreService
{
    Task GetAllTheatresAsync();
    Task GetTheatreByIdAsync(int id);
    Task CreateTheatreAsync();
    Task UpdateTheatreAsync(int id);
}