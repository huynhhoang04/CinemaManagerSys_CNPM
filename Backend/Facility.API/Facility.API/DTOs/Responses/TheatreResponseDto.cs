namespace Facility.API.DTOs.Responses;

/// <summary>
/// Kết quả trả về khi lấy danh sách / chi tiết rạp.
/// </summary>
public class TheatreResponseDto
{
    public int TheatreId { get; set; }
    public string TheatreName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Coordinates { get; set; } = string.Empty;
    public string PreviewUrl { get; set; } = string.Empty;
    public string Info { get; set; } = string.Empty;
    public string TheatreStatus { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
}