using Facility.API.Data;
using Facility.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Facility.API.Repositories;

public class TheatreRepository : ITheatreRepository
{
    private readonly FacilityDbContext _context;

    public TheatreRepository(FacilityDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Theatre>> GetAllAsync()
    {
        return await _context.Theatres.AsNoTracking().ToListAsync();
    }

    public async Task<IEnumerable<Theatre>> GetByCityAsync(string city)
    {
        return await _context.Theatres
            .AsNoTracking()
            .Where(t => t.City.ToLower() == city.ToLower())
            .ToListAsync();
    }

    public async Task<Theatre?> GetByIdAsync(int id)
    {
        return await _context.Theatres.FindAsync(id);
    }

    public async Task AddAsync(Theatre theatre)
    {
        await _context.Theatres.AddAsync(theatre);
    }

    public Task UpdateAsync(Theatre theatre)
    {
        _context.Theatres.Update(theatre);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}