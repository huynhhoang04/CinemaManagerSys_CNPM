using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movie.API.DTOs.Requests;
using Movie.API.Services;

namespace Movie.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MovieController : ControllerBase
{
    private readonly IMovieService _movieService;

    public MovieController(IMovieService movieService)
    {
        _movieService = movieService;
    }

    /// <summary>
    /// [Public] Lấy danh sách tất cả phim (kèm thể loại).
    /// GET /api/movie
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var movies = await _movieService.GetAllMoviesAsync();
        return Ok(movies);
    }

    /// <summary>
    /// [Public] Lấy chi tiết phim theo Id (kèm thể loại).
    /// GET /api/movie/{id}
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var movie = await _movieService.GetMovieByIdAsync(id);
        if (movie is null)
            return NotFound(new { message = $"Movie with id={id} was not found." });

        return Ok(movie);
    }

    /// <summary>
    /// [Admin] Thêm phim mới và tự động map thể loại vào bảng movie_genre trong 1 Transaction.
    /// POST /api/movie
    /// Body: MovieRequestDto (gồm thông tin phim + genre_ids[])
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] MovieRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _movieService.CreateMovieAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.MovieId }, created);
    }

    /// <summary>
    /// [Admin] Cập nhật thông tin phim: xóa map cũ, ghi map mới cho movie_genre.
    /// PUT /api/movie/{id}
    /// Body: MovieRequestDto (gồm thông tin phim + genre_ids[])
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] MovieRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _movieService.UpdateMovieAsync(id, dto);
        if (updated is null)
            return NotFound(new { message = $"Movie with id={id} was not found." });

        return Ok(updated);
    }

    /// <summary>
    /// [Admin] Xóa phim và tự động dọn rác bảng movie_genre.
    /// DELETE /api/movie/{id}
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _movieService.DeleteMovieAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Movie with id={id} was not found." });

        return NoContent();
    }
}