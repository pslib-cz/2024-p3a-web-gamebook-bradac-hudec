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
        public async Task<ActionResult<IEnumerable<PokemonTypes>>> GetPokemonTypes()
        {
            return await _context.PokemonTypes.ToListAsync();
        }

        // GET: api/PokemonTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PokemonTypes>> GetPokemonTypes(int id)
        {
            var pokemonTypes = await _context.PokemonTypes.FindAsync(id);

            if (pokemonTypes == null)
            {
                return NotFound();
            }

            return pokemonTypes;
        }

        // PUT: api/PokemonTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPokemonTypes(int id, PokemonTypes pokemonTypes)
        {
            if (id != pokemonTypes.TypeId)
            {
                return BadRequest();
            }

            _context.Entry(pokemonTypes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PokemonTypesExists(id))
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
        public async Task<ActionResult<IEnumerable<PokemonTypes>>> PostPokemonTypes([FromBody] List<PokemonTypes> pokemonTypesList)
        {
            // Přidáme všechny nové Pokémonní typy
            _context.PokemonTypes.AddRange(pokemonTypesList);
            await _context.SaveChangesAsync();

            // Vrátíme seznam přidaných Pokémonních typů jako odpověď
            return CreatedAtAction("GetPokemonTypes", new { ids = pokemonTypesList.Select(pt => pt.TypeId) }, pokemonTypesList);
        }


        // DELETE: api/PokemonTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePokemonTypes(int id)
        {
            var pokemonTypes = await _context.PokemonTypes.FindAsync(id);
            if (pokemonTypes == null)
            {
                return NotFound();
            }

            _context.PokemonTypes.Remove(pokemonTypes);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PokemonTypesExists(int id)
        {
            return _context.PokemonTypes.Any(e => e.TypeId == id);
        }
    }
}
