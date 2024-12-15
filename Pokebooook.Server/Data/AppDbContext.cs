using Microsoft.EntityFrameworkCore;
using Pokebooook.Server.Models;

namespace Pokebooook.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
            
        }

        public required DbSet<Pokemon> Pokemons { get; set; }
        public required DbSet<PokemonType> PokemonTypes { get; set; }
        public required DbSet<Location> Locations { get; set; }
        public required DbSet<User> Users { get; set; }
        public required DbSet<Connection> Connections { get; set; }
        public required DbSet<Attack> Attacks { get; set; }
        public required DbSet<Image> Images { get; set; }
        public DbSet<Pokebooook.Server.Models.Item> Item { get; set; } = default!;

    }
}
