﻿using Microsoft.AspNetCore.Components.Server.ProtectedBrowserStorage;
using Microsoft.EntityFrameworkCore;
using Pokebooook.Server.Models;

namespace Pokebooook.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
          base.OnConfiguring(optionsBuilder);
        }
        public DbSet<Pokemons> Pokemons { get; set; }
    }
}
