using System.ComponentModel.DataAnnotations;

namespace Facility.API.DTOs.Requests;

/// <summary>
/// Payload gửi lên khi tạo / cập nhật rạp.
/// Theo yêu cầu: Tên, Vị trí, Tọa độ.
/// </summary>
public class TheatreRequestDto
{
    /// <summary>Tên rạp (bắt buộc)</summary>
    [Required(ErrorMessage = "Tên rạp không được để trống.")]
    [MaxLength(150)]
    public string TheatreName { get; set; } = string.Empty;

    /// <summary>Vị trí / địa chỉ (bắt buộc)</summary>
    [Required(ErrorMessage = "Vị trí không được để trống.")]
    [MaxLength(255)]
    public string Location { get; set; } = string.Empty;

    /// <summary>Tọa độ GPS, ví dụ "10.762622,106.660172"</summary>
    [MaxLength(100)]
    public string Coordinates { get; set; } = string.Empty;

    /// <summary>Ảnh đại diện</summary>
    [MaxLength(500)]
    public string? PreviewUrl { get; set; }

    /// <summary>Mô tả / thông tin bổ sung</summary>
    public string? Info { get; set; }

    /// <summary>Thành phố</summary>
    [MaxLength(100)]
    public string? City { get; set; }
}