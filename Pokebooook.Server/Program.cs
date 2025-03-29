using Microsoft.EntityFrameworkCore;
using Pokebooook.Server.Data;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Přidání CORS služby
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Konfigurace HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Použití CORS před autorizací
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Endpoint pro API
app.MapGet("/api", () => "Pokebook API je funkční! Pro dokumentaci navštivte /swagger");

// Mapování pro SPA aplikaci
app.MapFallbackToFile("/index.html");

app.Run();
