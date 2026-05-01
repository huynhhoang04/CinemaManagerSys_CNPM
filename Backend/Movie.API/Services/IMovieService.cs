namespace Movie.API.Services;

public interface IMovieService
{
    Task GetAllMoviesAsync();
    Task GetMovieByIdAsync(int id);
    Task CreateMovieAsync(); 
    Task UpdateMovieAsync(int id);
    Task DeleteMovieAsync(int id);
}