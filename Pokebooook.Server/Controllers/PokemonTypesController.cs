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
    public class PokemonTypesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PokemonTypesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PokemonTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PokemonType>>> GetPokemonTypes()
        {
            return await _context.PokemonTypes.ToListAsync();
        }

        // GET: api/PokemonTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PokemonType>> GetPokemonType(int id)
        {
            var pokemonType = await _context.PokemonTypes.FindAsync(id);

            if (pokemonType == null)
            {
                return NotFound();
            }

            return pokemonType;
        }

        // PUT: api/PokemonTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPokemonType(int id, PokemonType pokemonType)
        {
            if (id != pokemonType.TypeId)
            {
                return BadRequest();
            }

            _context.Entry(pokemonType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PokemonTypeExists(id))
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

        // POST: api/PokemonTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<IEnumerable<PokemonType>>> PostPokemonTypes(IEnumerable<PokemonType> pokemonTypes)
        {
            _context.PokemonTypes.AddRange(pokemonTypes);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPokemonTypes", new { }, pokemonTypes);
        }

        // DELETE: api/PokemonTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePokemonType(int id)
        {
            var pokemonType = await _context.PokemonTypes.FindAsync(id);
            if (pokemonType == null)
            {
                return NotFound();
            }

            _context.PokemonTypes.Remove(pokemonType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PokemonTypeExists(int id)
        {
            return _context.PokemonTypes.Any(e => e.TypeId == id);
        }
    }
}
