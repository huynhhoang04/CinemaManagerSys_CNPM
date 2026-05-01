namespace Schedule.API.Services;

public interface IShowtimeService
{
    Task GetShowtimesByMovieIdAsync(int movieId);
    Task GetShowtimesByRoomIdAsync(int roomId);
    Task CreateShowtimeAsync(); 
        Task UpdateShowtimeAsync(int id);
    Task DeleteShowtimeAsync(int id);
}