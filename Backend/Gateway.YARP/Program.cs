var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // Quyền lực tuyệt đối: Chấp nhận mọi Domain (ngrok, lhr.life, localhost)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithExposedHeaders("WWW-Authenticate"); // Cho phép browser đọc header này để debug
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAll");

app.MapReverseProxy();

app.Run();