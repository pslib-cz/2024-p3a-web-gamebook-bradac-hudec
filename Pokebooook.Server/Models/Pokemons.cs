namespace Pokebooook.Server.Models
{
    public class Pokemons
    {
        public int PokedexId { get; set; }
        public required string Name { get; set; }
        public required string MainType { get; set; }
        public required int Health { get; set; }
        public required int Energy { get; set; }
        public required string[] Attacks { get; set; }
    }
}
