using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class Pokemon
    {
        [Key]
        public int PokedexId { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        [Required]
        public int Health { get; set; }

        public int? Energy { get; set; }

        [ForeignKey("PokemonType")]
        public int TypeId { get; set; }
        public required PokemonType PokemonType { get; set; } 

        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public required Image Image { get; set; } 
    }
}
