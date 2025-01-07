using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class Pokemon
    {
        [Key]
        public int PokemonId { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        [Required]
        public int Health { get; set; }


        public int? Energy { get; set; }

        [ForeignKey("PokemonType")]
        public int TypeId { get; set; }

        [ForeignKey("Image")]
        public int? ImageId { get; set; }

        [Required]
        public ICollection<PokemonAttack>? PokemonAttacks { get; set; }
    }
}
