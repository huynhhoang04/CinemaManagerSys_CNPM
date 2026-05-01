using Microsoft.AspNetCore.Mvc;
using Identity.API.DTOs.Requests;

namespace Identity.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        throw new NotImplementedException();
    }
}