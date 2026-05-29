using Cast.API.DTOs.Requests;
using Cast.API.DTOs.Responses;
using Cast.API.Models;
using Cast.API.Repositories;

namespace Cast.API.Services;

public class DirectorService : IDirectorService
{
    private readonly IDirectorRepository _repository;

    public DirectorService(IDirectorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<DirectorResponseDto>> GetAllAsync()
    {
        var directors = await _repository.GetAllAsync();
        return directors.Select(d => new DirectorResponseDto
        {
            Id = d.DirectorId,
            Name = d.DirectorName,
            Avatar = d.AvatarUrl,
            Bio = d.Bio
        });
    }

    public async Task<DirectorResponseDto?> GetByIdAsync(int id)
    {
        var d = await _repository.GetByIdAsync(id);
        if (d == null) return null;
        return new DirectorResponseDto
        {
            Id = d.DirectorId,
            Name = d.DirectorName,
            Avatar = d.AvatarUrl,
            Bio = d.Bio
        };
    }

    public async Task CreateAsync(DirectorRequestDto dto)
    {
        var director = new Director
        {
            DirectorName = dto.Name,
            AvatarUrl = dto.Avatar,
            Bio = dto.Bio
        };
        await _repository.AddAsync(director);
        await _repository.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, DirectorRequestDto dto)
    {
        var director = await _repository.GetByIdAsync(id);
        if (director == null) return;

        director.DirectorName = dto.Name;
        director.AvatarUrl = dto.Avatar;
        director.Bio = dto.Bio;

        await _repository.UpdateAsync(director);
        await _repository.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
    }

    public async Task<IEnumerable<DirectorResponseDto>> GetByMovieIdAsync(int movieId)
    {
        var maps = await _repository.GetByMovieIdAsync(movieId);
        var result = new List<DirectorResponseDto>();
        
        foreach (var map in maps)
        {
            var director = await _repository.GetByIdAsync(map.DirectorId);
            if (director != null)
            {
                result.Add(new DirectorResponseDto
                {
                    Id = director.DirectorId,
                    Name = director.DirectorName,
                    Avatar = director.AvatarUrl,
                    Bio = director.Bio
                });
            }
        }
        return result;
    }

    public async Task AssignToMovieAsync(int movieId, IEnumerable<int> directorIds)
    {
        await _repository.ClearMovieDirectorsAsync(movieId);
        
        var maps = directorIds.Select(id => new MovieDirector
        {
            MovieId = movieId,
            DirectorId = id
        });

        await _repository.AddMovieDirectorsAsync(maps);
        await _repository.SaveChangesAsync();
    }
}