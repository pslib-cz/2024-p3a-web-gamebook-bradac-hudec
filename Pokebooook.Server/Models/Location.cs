using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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

        public double RocketChance { get; set; }    

        [ForeignKey("Pokemon")]
        
        public int? PokemonId { get; set; }     

        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public List<string> Descriptions { get; set; } = new List<string>();

        [JsonIgnore]
        public List<Connection> ConnectionsFrom { get; set; } = [];

        [JsonIgnore]
        public List<Connection> ConnectionsTo { get; set; } = [];
    }
}
