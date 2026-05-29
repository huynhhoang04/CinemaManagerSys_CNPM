using Microsoft.EntityFrameworkCore;
using Cast.API.Data;
using Cast.API.Repositories;
using Cast.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

// Ngăn .NET tự động map các claim chuẩn sang tên khác
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

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
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    };
});

builder.Services.AddAuthorization();

builder.Services.AddDbContext<CastDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// Register Repositories
builder.Services.AddScoped<IActorRepository, ActorRepository>();
builder.Services.AddScoped<IDirectorRepository, DirectorRepository>();

// Register Services
builder.Services.AddScoped<IActorService, ActorService>();
builder.Services.AddScoped<IDirectorService, DirectorService>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();