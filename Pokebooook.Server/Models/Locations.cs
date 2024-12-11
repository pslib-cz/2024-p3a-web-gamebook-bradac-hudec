using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class Locations
    {
        [Key]
        public int LocationId { get; set; }

        public required string Name { get; set; }
        public required string[] Paths { get; set; }
        public Pokemons ?Pokemon { get; set; }
        public required double RocketChance { get; set; }
    }
}
