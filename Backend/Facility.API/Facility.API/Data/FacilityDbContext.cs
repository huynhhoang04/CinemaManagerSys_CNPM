using Microsoft.EntityFrameworkCore;
using Facility.API.Models;

namespace Facility.API.Data;

public class FacilityDbContext : DbContext
{
    public FacilityDbContext(DbContextOptions<FacilityDbContext> options) : base(options) { }

    public DbSet<Theatre> Theatres { get; set; }
    public DbSet<Room> Rooms { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Theatre ──────────────────────────────────────────
        modelBuilder.Entity<Theatre>(entity =>
        {
            entity.HasKey(t => t.TheatreId);
            entity.Property(t => t.TheatreName).IsRequired().HasMaxLength(150);
            entity.Property(t => t.Location).HasMaxLength(255);
            entity.Property(t => t.Coordinates).HasMaxLength(100);
            entity.Property(t => t.PreviewUrl).HasMaxLength(500);
            entity.Property(t => t.TheatreStatus).HasMaxLength(50).HasDefaultValue("Active");
            entity.Property(t => t.City).HasMaxLength(100);
        });

        // ── Room ─────────────────────────────────────────────
        modelBuilder.Entity<Room>(entity =>
        {
            entity.HasKey(r => r.RoomId);
            entity.Property(r => r.RoomName).IsRequired().HasMaxLength(100);
            entity.Property(r => r.RoomType).HasMaxLength(50);
            entity.Property(r => r.RoomStatus).HasMaxLength(50).HasDefaultValue("Active");

            entity.HasOne(r => r.Theatre)
                  .WithMany(t => t.Rooms)
                  .HasForeignKey(r => r.TheatreId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Seed data demo ───────────────────────────────────
        modelBuilder.Entity<Theatre>().HasData(
            new Theatre
            {
                TheatreId = 1,
                TheatreName = "CGV Vincom Center",
                Location = "Tầng 5, Vincom Center, 72 Lê Thánh Tôn, Q.1, TP.HCM",
                Coordinates = "10.7769,106.7009",
                PreviewUrl = "",
                Info = "Cụm rạp cao cấp tại trung tâm Quận 1",
                TheatreStatus = "Active",
                City = "Hồ Chí Minh"
            },
            new Theatre
            {
                TheatreId = 2,
                TheatreName = "CGV Aeon Mall Tân Phú",
                Location = "Tầng 3, Aeon Mall Tân Phú, 30 Bờ Bao Tân Thắng, Q.Tân Phú, TP.HCM",
                Coordinates = "10.8018,106.6180",
                PreviewUrl = "",
                Info = "Cụm rạp lớn tại khu vực Tân Phú",
                TheatreStatus = "Active",
                City = "Hồ Chí Minh"
            },
            new Theatre
            {
                TheatreId = 3,
                TheatreName = "Lotte Cinema Nowzone",
                Location = "Tầng 5, Nowzone, 235 Nguyễn Văn Cừ, Q.1, TP.HCM",
                Coordinates = "10.7622,106.6882",
                PreviewUrl = "",
                Info = "Rạp chiếu phim hiện đại tại Nowzone",
                TheatreStatus = "Active",
                City = "Hồ Chí Minh"
            }
        );

        modelBuilder.Entity<Room>().HasData(
            new Room { RoomId = 1, TheatreId = 1, RoomName = "Phòng 1", RoomType = "2D", Capacity = 120, RoomStatus = "Active" },
            new Room { RoomId = 2, TheatreId = 1, RoomName = "Phòng 2", RoomType = "3D", Capacity = 100, RoomStatus = "Active" },
            new Room { RoomId = 3, TheatreId = 1, RoomName = "Phòng IMAX", RoomType = "IMAX", Capacity = 200, RoomStatus = "Active" },
            new Room { RoomId = 4, TheatreId = 2, RoomName = "Phòng 1", RoomType = "2D", Capacity = 150, RoomStatus = "Active" },
            new Room { RoomId = 5, TheatreId = 2, RoomName = "Phòng 4DX", RoomType = "4DX", Capacity = 80, RoomStatus = "Active" },
            new Room { RoomId = 6, TheatreId = 3, RoomName = "Phòng A", RoomType = "2D", Capacity = 130, RoomStatus = "Active" }
        );
    }
}