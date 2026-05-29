using Cast.API.DTOs.Requests;
using Cast.API.DTOs.Responses;
using Cast.API.Models;
using Cast.API.Repositories;

namespace Cast.API.Services;

public class ActorService : IActorService
{
    private readonly IActorRepository _repository;

    public ActorService(IActorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ActorResponseDto>> GetAllAsync()
    {
        var actors = await _repository.GetAllAsync();
        return actors.Select(a => new ActorResponseDto
        {
            Id = a.ActorId,
            Name = a.ActorName,
            Avatar = a.AvatarUrl,
            Bio = a.Bio
        });
    }

    public async Task<ActorResponseDto?> GetByIdAsync(int id)
    {
        var a = await _repository.GetByIdAsync(id);
        if (a == null) return null;
        return new ActorResponseDto
        {
            Id = a.ActorId,
            Name = a.ActorName,
            Avatar = a.AvatarUrl,
            Bio = a.Bio
        };
    }

    public async Task CreateAsync(ActorRequestDto dto)
    {
        var actor = new Actor
        {
            ActorName = dto.Name,
            AvatarUrl = dto.Avatar,
            Bio = dto.Bio
        };
        await _repository.AddAsync(actor);
        await _repository.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, ActorRequestDto dto)
    {
        var actor = await _repository.GetByIdAsync(id);
        if (actor == null) return;

        actor.ActorName = dto.Name;
        actor.AvatarUrl = dto.Avatar;
        actor.Bio = dto.Bio;

        await _repository.UpdateAsync(actor);
        await _repository.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
    }

    public async Task<IEnumerable<MovieActorResponseDto>> GetByMovieIdAsync(int movieId)
    {
        var maps = await _repository.GetByMovieIdAsync(movieId);
        var result = new List<MovieActorResponseDto>();
        
        foreach (var map in maps)
        {
            var actor = await _repository.GetByIdAsync(map.ActorId);
            if (actor != null)
            {
                result.Add(new MovieActorResponseDto
                {
                    Id = actor.ActorId,
                    Name = actor.ActorName,
                    Avatar = actor.AvatarUrl,
                    Bio = actor.Bio,
                    CharacterName = map.CharacterName
                });
            }
        }
        return result;
    }

    public async Task AssignToMovieAsync(int movieId, IEnumerable<MovieActorMapDto> actorMaps)
    {
        await _repository.ClearMovieActorsAsync(movieId);
        
        var maps = actorMaps.Select(dto => new MovieActor
        {
            MovieId = movieId,
            ActorId = dto.ActorId,
            CharacterName = dto.CharacterName
        });

        await _repository.AddMovieActorsAsync(maps);
        await _repository.SaveChangesAsync();
    }
}