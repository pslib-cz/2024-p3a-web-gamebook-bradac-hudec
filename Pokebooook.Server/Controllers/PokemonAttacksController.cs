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
    public class PokemonAttacksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PokemonAttacksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PokemonAttacks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PokemonAttack>>> GetPokemonAttack()
        {
            return await _context.PokemonAttack.ToListAsync();
        }

        // GET: api/PokemonAttacks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PokemonAttack>> GetPokemonAttack(int id)
        {
            var pokemonAttack = await _context.PokemonAttack.FindAsync(id);

            if (pokemonAttack == null)
            {
                return NotFound();
            }

            return pokemonAttack;
        }

        // PUT: api/PokemonAttacks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPokemonAttack(int id, PokemonAttack pokemonAttack)
        {
            if (id != pokemonAttack.PokemonAttackId)
            {
                return BadRequest();
            }

            _context.Entry(pokemonAttack).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PokemonAttackExists(id))
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

        // POST: api/PokemonAttacks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PokemonAttack>> PostPokemonAttack(PokemonAttack pokemonAttack)
        {
            _context.PokemonAttack.Add(pokemonAttack);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPokemonAttack", new { id = pokemonAttack.PokemonAttackId }, pokemonAttack);
        }

        // DELETE: api/PokemonAttacks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePokemonAttack(int id)
        {
            var pokemonAttack = await _context.PokemonAttack.FindAsync(id);
            if (pokemonAttack == null)
            {
                return NotFound();
            }

            _context.PokemonAttack.Remove(pokemonAttack);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PokemonAttackExists(int id)
        {
            return _context.PokemonAttack.Any(e => e.PokemonAttackId == id);
        }
    }
}
