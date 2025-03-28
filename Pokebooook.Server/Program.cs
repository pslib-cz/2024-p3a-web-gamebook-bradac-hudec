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

// Hashování existujících hesel, pokud byl zadán argument příkazové řádky
if (args.Length > 0 && args[0] == "hash-passwords")
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        try
        {
            // Najdi všechny uživatele, jejichž hesla nejsou hashovaná
            var usersWithPlaintextPasswords = context.Users
                .Where(u => !u.Password.StartsWith("$2a$") && 
                          !u.Password.StartsWith("$2b$") && 
                          !u.Password.StartsWith("$2y$"))
                .ToList();

            if (usersWithPlaintextPasswords.Count == 0)
            {
                Console.WriteLine("Žádná hesla k hashování nebyla nalezena.");
            }
            else
            {
                Console.WriteLine($"Nalezeno {usersWithPlaintextPasswords.Count} nehashovaných hesel.");
                
                foreach (var user in usersWithPlaintextPasswords)
                {
                    var plaintextPassword = user.Password;
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plaintextPassword);
                    
                    user.Password = hashedPassword;
                    
                    Console.WriteLine($"Zahashováno heslo pro uživatele: {user.Email}");
                }

                context.SaveChanges();
                Console.WriteLine("Všechna hesla byla úspěšně zahashována.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Došlo k chybě při hashování hesel: {ex.Message}");
        }
    }
    
    // Pokud byl pouze požadavek na hashování, ukončíme aplikaci
    if (args.Length > 1 && args[1] == "--exit")
    {
        return;
    }
}

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

app.MapFallbackToFile("/index.html");

app.Run();
