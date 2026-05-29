using Identity.API.DTOs.Requests;
using Identity.API.DTOs.Responses;
using Identity.API.Models;
using Identity.API.Repositories;
using BC = BCrypt.Net.BCrypt;

namespace Identity.API.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return users.Select(u => new UserDto
        {
            Id = u.UserId,
            Username = u.Username,
            Fullname = u.FullName,
            Email = u.Email,
            Role = u.Role
        });
    }

    public async Task CreateUserAsync(CreateUserRequestDto request)
    {
        var existing = await _userRepository.GetUserByUsernameAsync(request.Username);
        if (existing != null)
            throw new InvalidOperationException("Username đã tồn tại");

        var user = new User
        {
            Username = request.Username,
            Password = BC.HashPassword(request.Password),
            FullName = request.Fullname,
            Email = request.Email,
            Role = request.Role
        };

        await _userRepository.CreateUserAsync(user);
        await _userRepository.SaveChangesAsync();
    }

    public async Task UpdateUserAsync(int id, UpdateUserRequestDto request)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null)
            throw new KeyNotFoundException("Không tìm thấy người dùng");

        user.FullName = request.Fullname;
        user.Email = request.Email;

        await _userRepository.UpdateUserAsync(user);
        await _userRepository.SaveChangesAsync();
    }

    public async Task PromoteUserAsync(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null)
            throw new KeyNotFoundException("Không tìm thấy người dùng");

        if (user.Role == "Admin")
            throw new InvalidOperationException("Người dùng đã là Admin, không thể thăng cấp thêm");

        user.Role = "Admin";
        await _userRepository.UpdateUserAsync(user);
        await _userRepository.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null)
            throw new KeyNotFoundException("Không tìm thấy người dùng");

        if (user.Role == "Admin")
            throw new InvalidOperationException("Không thể xóa tài khoản có quyền Admin để đảm bảo an toàn hệ thống");

        await _userRepository.DeleteUserAsync(user);
        await _userRepository.SaveChangesAsync();
    }
}