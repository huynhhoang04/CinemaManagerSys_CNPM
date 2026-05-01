using Microsoft.EntityFrameworkCore;
using Identity.API.Models;
using BC = BCrypt.Net.BCrypt;

namespace Identity.API.Data;

public class IdentityDbContext : DbContext
{
    public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Password).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
        });

        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                Username = "admin",
                Password = BC.HashPassword("4105"),
                FullName = "System Administrator",
                Email = "admin@cinema.local",
                Role = "Admin"
            }
        );
    }
}