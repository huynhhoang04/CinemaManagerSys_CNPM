using Microsoft.EntityFrameworkCore;
using Movie.API.Data;
using Movie.API.Repositories;
using Movie.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Logging;

// Ngăn .NET tự động map các claim chuẩn sang tên khác
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// Cho phép hiển thị chi tiết lỗi bảo mật (Chỉ dùng trong môi trường Dev)
IdentityModelEventSource.ShowPII = true;
IdentityModelEventSource.LogCompleteSecurityArtifact = true;

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var keyString = jwtSettings["Key"] ?? "ThisIsAVerySecretKeyForDevelopmentPurposes123!";
var key = Encoding.UTF8.GetBytes(keyString);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.IncludeErrorDetails = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, // Tạm tắt để cô lập lỗi
        ValidateAudience = false, // Tạm tắt để cô lập lỗi
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.FromMinutes(5),
        NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// Register Repositories
builder.Services.AddScoped<IMovieRepository, MovieRepository>();
builder.Services.AddScoped<IGenreRepository, GenreRepository>();

// Register Services
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IGenreService, GenreService>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();