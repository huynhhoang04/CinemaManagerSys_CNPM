namespace Cast.API.Services;

public interface ICastMappingService
{
    // Quản lý Actor
    Task GetAllActorsAsync();
    Task CreateActorAsync();
    Task UpdateActorAsync(int id);
    Task AssignActorsToMovieAsync(int movieId);
    Task GetActorsByMovieIdAsync(int movieId);

    // Quản lý Director
    Task GetAllDirectorsAsync();
    Task CreateDirectorAsync();
    Task UpdateDirectorAsync(int id);
    Task AssignDirectorsToMovieAsync(int movieId);
    Task GetDirectorsByMovieIdAsync(int movieId);
}