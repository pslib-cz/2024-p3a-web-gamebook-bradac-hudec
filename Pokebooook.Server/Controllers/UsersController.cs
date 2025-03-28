using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pokebooook.Server.Data;
using Pokebooook.Server.Models;
using BCrypt.Net;

namespace Pokebooook.Server.Controllers
{
    // Model třídy pro požadavek přihlášení
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Model třídy pro požadavek registrace
    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsAdmin { get; set; }
    }

    // Model třídy pro odpověď přihlášení
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public UserDTO? User { get; set; }
    }

    // DTO pro uživatele (Data Transfer Object) - bez hesla
    public class UserDTO
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool IsAdmin { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Users/Login
        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest loginRequest)
        {
            // Ošetření prázdného požadavku
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest(new LoginResponse 
                { 
                    Success = false, 
                    Message = "Email a heslo jsou povinné" 
                });
            }

            // Hledání uživatele podle emailu
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

            // Pokud uživatel nebyl nalezen
            if (user == null)
            {
                return NotFound(new LoginResponse 
                { 
                    Success = false, 
                    Message = "Uživatel nebyl nalezen" 
                });
            }

            // Ověření hesla pomocí BCrypt
            bool passwordValid = false;
            
            try
            {
                // Pokud heslo začíná $2a$, $2b$ nebo $2y$ (BCrypt hash prefix), použijeme BCrypt.Verify
                if (user.Password.StartsWith("$2a$") || user.Password.StartsWith("$2b$") || user.Password.StartsWith("$2y$"))
                {
                    passwordValid = BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password);
                }
                else
                {
                    // Pro zpětnou kompatibilitu - pokud heslo není zahashované, ověříme přímo
                    // Toto je dočasné řešení během migrace na hashovaná hesla
                    passwordValid = user.Password == loginRequest.Password;
                }
            }
            catch (Exception)
            {
                // Pokud nastane chyba při ověřování, považujeme heslo za neplatné
                passwordValid = false;
            }

            if (!passwordValid)
            {
                return Unauthorized(new LoginResponse 
                { 
                    Success = false, 
                    Message = "Nesprávné heslo" 
                });
            }

            // Ověření, zda je uživatel admin
            if (!user.IsAdmin)
            {
                return Unauthorized(new LoginResponse 
                { 
                    Success = false, 
                    Message = "Nemáte oprávnění administrátora" 
                });
            }

            // Vytvoření DTO objektu s bezpečnými daty (bez hesla)
            var userDTO = new UserDTO
            {
                UserId = user.UserId,
                Email = user.Email,
                IsAdmin = user.IsAdmin
            };

            // Úspěšné přihlášení
            return Ok(new LoginResponse 
            { 
                Success = true, 
                Message = "Přihlášení úspěšné", 
                User = userDTO 
            });
        }

        // POST: api/Users/Register
        [HttpPost("Register")]
        public async Task<ActionResult<LoginResponse>> Register(RegisterRequest registerRequest)
        {
            // Ošetření prázdného požadavku
            if (registerRequest == null || string.IsNullOrEmpty(registerRequest.Email) || string.IsNullOrEmpty(registerRequest.Password))
            {
                return BadRequest(new LoginResponse 
                { 
                    Success = false, 
                    Message = "Email a heslo jsou povinné" 
                });
            }

            // Ověření, zda email již existuje
            if (await _context.Users.AnyAsync(u => u.Email == registerRequest.Email))
            {
                return Conflict(new LoginResponse 
                { 
                    Success = false, 
                    Message = "Uživatel s tímto emailem již existuje" 
                });
            }

            // Hashování hesla pomocí BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password);

            // Vytvoření nového uživatele
            var user = new User
            {
                Email = registerRequest.Email,
                Password = passwordHash,
                IsAdmin = registerRequest.IsAdmin
            };

            // Uložení uživatele do databáze
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Vytvoření DTO objektu s bezpečnými daty (bez hesla)
            var userDTO = new UserDTO
            {
                UserId = user.UserId,
                Email = user.Email,
                IsAdmin = user.IsAdmin
            };

            // Úspěšná registrace
            return Ok(new LoginResponse 
            { 
                Success = true, 
                Message = "Registrace úspěšná", 
                User = userDTO 
            });
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            // Pokud je heslo změněno, zahashujeme ho
            var existingUser = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == id);
            if (existingUser != null && existingUser.Password != user.Password)
            {
                // Heslo bylo změněno, zahashujeme ho
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Hashování hesla před uložením
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
