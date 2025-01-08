using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pokebooook.Server.Models
{
    public class PokemonAttack
    {
        [Key]
        public int PokemonAttackId { get; set; }

        [ForeignKey("Attack")]
        public int AttackId { get; set; }

        [ForeignKey("Pokemon")]
        public int PokemonId { get; set; }

        public Attack? Attack { get; set; }
    }
}
