namespace Cast.API.Services;

public class CastMappingService : ICastMappingService
{
    public Task GetAllActorsAsync() => throw new NotImplementedException();
    public Task CreateActorAsync() => throw new NotImplementedException();
    public Task UpdateActorAsync(int id) => throw new NotImplementedException();
    public Task AssignActorsToMovieAsync(int movieId) => throw new NotImplementedException();
    public Task GetActorsByMovieIdAsync(int movieId) => throw new NotImplementedException();

    public Task GetAllDirectorsAsync() => throw new NotImplementedException();
    public Task CreateDirectorAsync() => throw new NotImplementedException();
    public Task UpdateDirectorAsync(int id) => throw new NotImplementedException();
    public Task AssignDirectorsToMovieAsync(int movieId) => throw new NotImplementedException();
    public Task GetDirectorsByMovieIdAsync(int movieId) => throw new NotImplementedException();
}