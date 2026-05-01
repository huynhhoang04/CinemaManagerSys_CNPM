using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Facility.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TheatreController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => throw new NotImplementedException();

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) => throw new NotImplementedException();

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create() => throw new NotImplementedException();

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id) => throw new NotImplementedException();
}