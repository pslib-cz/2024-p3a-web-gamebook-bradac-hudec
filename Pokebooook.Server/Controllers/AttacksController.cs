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
    public class AttacksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttacksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Attacks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attacks>>> GetAttacks()
        {
            return await _context.Attacks.ToListAsync();
        }

        // GET: api/Attacks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attacks>> GetAttacks(int id)
        {
            var attacks = await _context.Attacks.FindAsync(id);

            if (attacks == null)
            {
                return NotFound();
            }

            return attacks;
        }

        // PUT: api/Attacks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttacks(int id, Attacks attacks)
        {
            if (id != attacks.AttackId)
            {
                return BadRequest();
            }

            _context.Entry(attacks).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttacksExists(id))
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

        // POST: api/Attacks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attacks>> PostAttacks(Attacks attacks)
        {
            _context.Attacks.Add(attacks);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttacks", new { id = attacks.AttackId }, attacks);
        }

        // DELETE: api/Attacks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttacks(int id)
        {
            var attacks = await _context.Attacks.FindAsync(id);
            if (attacks == null)
            {
                return NotFound();
            }

            _context.Attacks.Remove(attacks);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttacksExists(int id)
        {
            return _context.Attacks.Any(e => e.AttackId == id);
        }
    }
}
