using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class Location
    {
        [Key]
        public int LocationId { get; set; }

        [Required]
        [MaxLength(255)]
        public required string Name { get; set; }

        public required bool HasPokemon { get; set; }

        public required Location[] Paths { get; set; }

        public double RocketChance { get; set; }

        [ForeignKey("Pokemon")]
        public int? PokemonId { get; set; }
        public required Pokemon Pokemon { get; set; } 

        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public required Image Image { get; set; } 
    }
}
