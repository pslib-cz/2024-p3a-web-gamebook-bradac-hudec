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
        public async Task<ActionResult<IEnumerable<Attack>>> GetAttacks()
        {
            return await _context.Attacks.ToListAsync();
        }

        // GET: api/Attacks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attack>> GetAttack(int id)
        {
            var attack = await _context.Attacks.FindAsync(id);

            if (attack == null)
            {
                return NotFound();
            }

            return attack;
        }

        // PUT: api/Attacks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttack(int id, Attack attack)
        {
            if (id != attack.AttackId)
            {
                return BadRequest();
            }

            _context.Entry(attack).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttackExists(id))
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
        public async Task<ActionResult<IEnumerable<Attack>>> PostAttack(IEnumerable<Attack> attacks)
        {
            if (attacks == null || !attacks.Any())
            {
                return BadRequest("No attacks provided.");
            }

            _context.Attacks.AddRange(attacks);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Count = attacks.Count(),
                AddedAttacks = attacks.Select(a => new { a.AttackId, a.Name, a.EnergyCost, a.BaseDamage })
            });
        }


        // DELETE: api/Attacks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttack(int id)
        {
            var attack = await _context.Attacks.FindAsync(id);
            if (attack == null)
            {
                return NotFound();
            }

            _context.Attacks.Remove(attack);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttackExists(int id)
        {
            return _context.Attacks.Any(e => e.AttackId == id);
        }
    }
}
