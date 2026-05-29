using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Identity.API.DTOs.Requests;
using Identity.API.Services;

namespace Identity.API.Controllers;

[ApiController]
[Route("api/identity/users")]
[Authorize(Roles = "Admin")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _userService.CreateUserAsync(request);
            return StatusCode(201, new { message = "Tạo tài khoản thành công" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _userService.UpdateUserAsync(id, request);
            return Ok(new { message = "Cập nhật thành công" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("{id}/promote")]
    public async Task<IActionResult> PromoteUser(int id)
    {
        try
        {
            await _userService.PromoteUserAsync(id);
            return Ok(new { message = "Đã thăng cấp lên Admin" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        // Lấy ID user đang đăng nhập từ JWT (đã khớp với ClaimTypes.NameIdentifier trong TokenService)
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (currentUserIdClaim != null && currentUserIdClaim.Value == id.ToString())
            return BadRequest(new { message = "Bạn không thể tự xóa chính mình" });

        try
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}