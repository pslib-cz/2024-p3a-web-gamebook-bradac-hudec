using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class Attack
    {
        [Key]
        public int AttackId { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required double EnergyCost { get; set; }

        [Required]
        public required double BaseDamage { get; set; }
    }
}
