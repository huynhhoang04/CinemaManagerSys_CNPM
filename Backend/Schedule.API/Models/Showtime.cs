using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Schedule.API.Models;

[Table("showtime")]
public class Showtime
{
    [Key]
    [Column("showtime_id")]
    public int ShowtimeId { get; set; }

    [Column("movie_id")]
    public int MovieId { get; set; } 

    [Column("room_id")]
    public int RoomId { get; set; } 

    [Column("started")]
    public DateTime Started { get; set; }

    [Column("price", TypeName = "numeric(10,2)")]
    public decimal Price { get; set; }
}