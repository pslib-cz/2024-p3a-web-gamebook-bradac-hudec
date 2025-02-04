using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pokebooook.Server.Data;
using Pokebooook.Server.Models;

namespace Pokebooook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImagesController(AppDbContext context,IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Images
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Image>>> GetImages()
        {
            return await _context.Images.ToListAsync();
        }

        // GET: api/Images/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var image = await _context.Images.FindAsync(id);

            if (image == null)
            {
                return NotFound();
            }

            return File(image.Data, image.Type);
        }



        [HttpPost("Upload")]
        public async Task<IActionResult> UploadImage(IFormFile file, [FromForm] int? id = null)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var fileName = Path.GetFileName(file.FileName);
            var contentType = file.ContentType;

            var webRoot = _webHostEnvironment.WebRootPath;

            var uploadsFolder = Path.Combine(webRoot, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Pokud je ID poskytnuto, ověř, že takové ID ještě neexistuje.
            if (id.HasValue)
            {
                var existingImage = await _context.Images.FindAsync(id.Value);
                if (existingImage != null)
                {
                    return BadRequest($"Image with ID {id.Value} already exists.");
                }
            }

            // Vytvoř nový obrázek s poskytnutým nebo automaticky generovaným ID.
            var image = new Image
            {
                ImageId = id ?? 0, // Pokud není ID zadáno, použije se hodnota 0 (autoincrement databáze ji nahradí).
                Name = fileName,
                Type = contentType,
                Data = System.IO.File.ReadAllBytes(filePath)
            };

            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            return Ok(new { ImageId = image.ImageId, Name = image.Name, Type = image.Type });
        }


        // PUT: api/Images/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutImage(int id, Image image)
        {
            if (id != image.ImageId)
            {
                return BadRequest();
            }

            _context.Entry(image).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImageExists(id))
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


        // DELETE: api/Images/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null)
            {
                return NotFound();
            }

            _context.Images.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }



      



        [HttpPost]
        public async Task<ActionResult<Image>> PostImage(Image image)
        {
            if (image.ImageId != 0)
            {
                // Check if ID already exists
                var existingImage = await _context.Images.FindAsync(image.ImageId);
                if (existingImage != null)
                {
                    return BadRequest($"Image with ID {image.ImageId} already exists.");
                }
            }

            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetImage), new { id = image.ImageId }, image);
        }


        private bool ImageExists(int id)
        {
            return _context.Images.Any(e => e.ImageId == id);
        }
    }
}
