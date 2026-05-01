using Microsoft.AspNetCore.Mvc;

namespace Movie.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenreController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => throw new NotImplementedException();
}