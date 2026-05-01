using Microsoft.AspNetCore.Mvc;
using Movie.API.Services;

namespace Movie.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenreController : ControllerBase
{
    private readonly IGenreService _genreService;

    public GenreController(IGenreService genreService)
    {
        _genreService = genreService;
    }

    /// <summary>
    /// Lấy danh sách tất cả thể loại phim.
    /// </summary>
    /// <returns>Danh sách GenreResponseDto</returns>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var genres = await _genreService.GetAllGenresAsync();
        return Ok(genres);
    }
}