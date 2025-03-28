﻿using System;
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
        public async Task<ActionResult<IEnumerable<Pokemon>>> GetPokemons()
        {
            return await _context.Pokemons
                .Include(p => p.PokemonAttacks)
                .ToListAsync();
        }


        // GET: api/Pokemons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pokemon>> GetPokemon(int id)
        {
            var pokemon = await _context.Pokemons
                .Include(p => p.PokemonAttacks)  
                .ThenInclude(pa => pa.Attack)    
                .FirstOrDefaultAsync(p => p.PokemonId == id); 

            if (pokemon == null)
            {
                return NotFound();
            }


            var result = new
            {
                pokemon.PokemonId,
                pokemon.Name,
                pokemon.Health,
                pokemon.Energy,
                pokemon.TypeId,
                pokemon.ImageId,
                PokemonAttacks = pokemon.PokemonAttacks?.Select(pa => new
                {
                    pa.PokemonAttackId,
                    AttackName = pa.Attack.Name,  
                    EnergyCost = pa.Attack.EnergyCost,
                    BaseDamage = pa.Attack.BaseDamage
                }).ToList()
            };

            return Ok(result);
        }



        // PUT: api/Pokemons/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPokemon(int id, Pokemon pokemon)
        {
            if (id != pokemon.PokemonId)
            {
                return BadRequest();
            }

            _context.Entry(pokemon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PokemonExists(id))
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
        public async Task<ActionResult<IEnumerable<Pokemon>>> PostPokemons(IEnumerable<Pokemon> pokemons)
        {
            _context.Pokemons.AddRange(pokemons);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPokemons", new { }, pokemons);
        }

        // DELETE: api/Pokemons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePokemon(int id)
        {
            var pokemon = await _context.Pokemons.FindAsync(id);
            if (pokemon == null)
            {
                return NotFound();
            }

            _context.Pokemons.Remove(pokemon);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PokemonExists(int id)
        {
            return _context.Pokemons.Any(e => e.PokemonId == id);
        }
    }
}
