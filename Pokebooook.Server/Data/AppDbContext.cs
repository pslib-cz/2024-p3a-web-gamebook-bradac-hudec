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
        public required DbSet<PokemonAttack> PokemonAttacks { get; set; }
        public DbSet<Pokebooook.Server.Models.Item> Item { get; set; } = default!;

        // onmodel
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /*modelBuilder.Entity<Pokemon>()
                .HasOne(p => p.PokemonType)
                .WithMany()
                .HasForeignKey(p => p.TypeId);
            modelBuilder.Entity<Pokemon>()
                .HasOne(p => p.Image)
                .WithMany()
                .HasForeignKey(p => p.ImageId);
            modelBuilder.Entity<Pokemon>()
                .HasMany(p => p.Attacks)
                .WithMany(a => a.Pokemons);
            modelBuilder.Entity<Location>()
                .HasOne(l => l.Pokemon)
                .WithMany()
                .HasForeignKey(l => l.PokemonId);
            modelBuilder.Entity<Location>()
                .HasOne(l => l.Image)
                .WithMany()
                .HasForeignKey(l => l.ImageId);*/
            modelBuilder.Entity<Connection>()
                .HasOne(c => c.LocationFrom)
                .WithMany(l => l.ConnectionsFrom)
                .HasForeignKey(c => c.LocationFromId);
            modelBuilder.Entity<Connection>()
                .HasOne(c => c.LocationTo)
                .WithMany(l => l.ConnectionsTo)
                .HasForeignKey(c => c.LocationToId);
            /*modelBuilder.Entity<Attack>()
                .HasOne(a => a.Image)
                .WithMany()
                .HasForeignKey(a => a.ImageId);
            modelBuilder.Entity<Item>()
                .HasOne(i => i.Image)
                .WithMany()
                .HasForeignKey(i => i.ImageId);*/
        }
        public DbSet<Pokebooook.Server.Models.PokemonAttack> PokemonAttack { get; set; } = default!;

    }
}
