using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class PokemonTypes
    {
        [Key]
        public int TypeId { get; set; }

        public required string Name { get; set; }
        public required string TypeIcon { get; set; }
    
    }
}
