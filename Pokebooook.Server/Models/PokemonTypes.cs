using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class PokemonTypes
    {
        [Key]
        public int TypeId { get; set; }

        public required string Name { get; set; }
        public required string TypeIcon { get; set; }
        public required double ToGround { get; set; }
        public required double ToGrass { get; set; }
        public required double ToFire { get; set; }
        public required double ToWater { get; set; }
        public required double ToElectric { get; set; }
        public required double ToPsychic { get; set; }
        public required double ToFighting { get; set; }
        public required double ToPoison { get; set; }
        public required double ToFlying { get; set; }
        public required double ToBug { get; set; }
        public required double ToRock { get; set; }
        public required double ToGhost { get; set; }
        public required double ToDark { get; set; }
        public required double ToDragon { get; set; }
        public required double ToSteel { get; set; }
        public required double ToFairy { get; set; }
        public required double ToIce { get; set; }
        public required double ToNormal { get; set; }

    }
}
