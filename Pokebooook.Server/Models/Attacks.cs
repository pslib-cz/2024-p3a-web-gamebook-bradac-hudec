namespace Pokebooook.Server.Models
{
    public class Attacks
    {
        public required int AttackId { get; set; }
        public required string Name { get; set; }
        public required double EnergyCost { get; set; }
        public required double BaseDamage { get; set; }

    }
}
