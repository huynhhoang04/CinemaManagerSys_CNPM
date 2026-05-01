using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Identity.API.DTOs.Requests;

namespace Identity.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UserController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        throw new NotImplementedException();
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDto request)
    {
        throw new NotImplementedException();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequestDto request)
    {
        throw new NotImplementedException();
    }

    [HttpPatch("{id}/promote")]
    public async Task<IActionResult> PromoteUser(int id)
    {
        throw new NotImplementedException();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        throw new NotImplementedException();
    }
}