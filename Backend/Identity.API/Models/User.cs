using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Identity.API.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("userid")]
    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("username")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("password")]
    public string Password { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("fullname")]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("role")]
    public string Role { get; set; } = "Staff";
}