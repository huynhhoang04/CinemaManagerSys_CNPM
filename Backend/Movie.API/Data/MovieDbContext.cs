using Microsoft.EntityFrameworkCore;
using Movie.API.Models;

namespace Movie.API.Data;

public class MovieDbContext : DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) { }

    public DbSet<Models.Movie> Movies { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<MovieGenre> MovieGenres { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Định nghĩa khóa chính kép (Composite Key) cho bảng trung gian
        modelBuilder.Entity<MovieGenre>()
            .HasKey(mg => new { mg.MovieId, mg.GenreId });
    }
}