using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class Attacks
    {
        [Key]
        public required int AttackId { get; set; }

        public required string Name { get; set; }
        public required double EnergyCost { get; set; }
        public required double BaseDamage { get; set; }

    }
}
