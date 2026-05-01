using Microsoft.EntityFrameworkCore;
using Facility.API.Models;

namespace Facility.API.Data;

public class FacilityDbContext : DbContext
{
    public FacilityDbContext(DbContextOptions<FacilityDbContext> options) : base(options) { }

    public DbSet<Theatre> Theatres { get; set; }
    public DbSet<Room> Rooms { get; set; }
}