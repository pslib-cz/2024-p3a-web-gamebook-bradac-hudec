using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pokebooook.Server.Data;
using Pokebooook.Server.Models;

namespace Pokebooook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PokemonsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Pokemons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pokemons>>> GetPokemons()
        {
            return await _context.Pokemons.ToListAsync();
        }

        // GET: api/Pokemons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pokemons>> GetPokemons(int id)
        {
            var pokemons = await _context.Pokemons.FindAsync(id);

            if (pokemons == null)
            {
                return NotFound();
            }

            return pokemons;
        }

        // PUT: api/Pokemons/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPokemons(int id, Pokemons pokemons)
        {
            if (id != pokemons.PokedexId)
            {
                return BadRequest();
            }

            _context.Entry(pokemons).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PokemonsExists(id))
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

        // POST: api/Pokemons
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<IEnumerable<Pokemons>>> PostPokemons([FromBody] List<Pokemons> pokemons)
        {
            if (pokemons == null || pokemons.Count == 0)
            {
                return BadRequest("No pokemons provided.");
            }

            const int batchSize = 50; // Nastavíme velikost dávky na 50
            var totalPokemons = pokemons.Count;
            var batches = (int)Math.Ceiling((double)totalPokemons / batchSize); // Počet dávek, které budeme zpracovávat

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Vkládáme Pokémony po dávkách
                    for (int i = 0; i < batches; i++)
                    {
                        // Vytvoříme dávku pro každý cyklus
                        var batch = pokemons.Skip(i * batchSize).Take(batchSize).ToList();

                        // Přidáme dávku Pokémonů do DB
                        await _context.Pokemons.AddRangeAsync(batch);

                        // Uložíme změny pro tuto dávku
                        await _context.SaveChangesAsync();
                    }

                    // Potvrdíme transakci, všechny změny budou uloženy
                    await transaction.CommitAsync();

                    return CreatedAtAction("GetPokemons", new { ids = string.Join(",", pokemons.Select(p => p.PokedexId)) }, pokemons);
                }
                catch (Exception ex)
                {
                    // Pokud dojde k chybě, vrátíme všechny změny zpět
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"An error occurred while inserting pokemons: {ex.Message}");
                }
            }
        }

        // DELETE: api/Pokemons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePokemons(int id)
        {
            var pokemons = await _context.Pokemons.FindAsync(id);
            if (pokemons == null)
            {
                return NotFound();
            }

            _context.Pokemons.Remove(pokemons);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PokemonsExists(int id)
        {
            return _context.Pokemons.Any(e => e.PokedexId == id);
        }
    }
}
