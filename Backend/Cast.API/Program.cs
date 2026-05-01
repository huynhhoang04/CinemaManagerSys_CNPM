using Microsoft.EntityFrameworkCore;
using Cast.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CastDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthorization();

app.MapControllers();

app.Run();