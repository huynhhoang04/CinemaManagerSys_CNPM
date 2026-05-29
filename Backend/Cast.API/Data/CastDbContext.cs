using Microsoft.EntityFrameworkCore;
using Cast.API.Models;

namespace Cast.API.Data;

public class CastDbContext : DbContext
{
    public CastDbContext(DbContextOptions<CastDbContext> options) : base(options) { }

    public DbSet<Actor> Actors { get; set; }
    public DbSet<Director> Directors { get; set; }
    public DbSet<MovieActor> MovieActors { get; set; }
    public DbSet<MovieDirector> MovieDirectors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Many-to-Many: MovieActor
        modelBuilder.Entity<MovieActor>()
            .HasKey(ma => new { ma.MovieId, ma.ActorId });

        // Many-to-Many: MovieDirector
        modelBuilder.Entity<MovieDirector>()
            .HasKey(md => new { md.MovieId, md.DirectorId });
            
        base.OnModelCreating(modelBuilder);
    }
}