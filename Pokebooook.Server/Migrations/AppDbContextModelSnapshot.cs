﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Pokebooook.Server.Data;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("Pokebooook.Server.Models.Attack", b =>
                {
                    b.Property<int>("AttackId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<double>("BaseDamage")
                        .HasColumnType("REAL");

                    b.Property<double>("EnergyCost")
                        .HasColumnType("REAL");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("AttackId");

                    b.ToTable("Attacks");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.Connection", b =>
                {
                    b.Property<int>("ConnectionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("LocationFromId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("LocationToId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ConnectionId");

                    b.HasIndex("LocationFromId");

                    b.HasIndex("LocationToId");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.Image", b =>
                {
                    b.Property<int>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.HasKey("ImageId");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.Item", b =>
                {
                    b.Property<int>("ItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("ImageId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ItemId");

                    b.ToTable("Item");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.Location", b =>
                {
                    b.Property<int>("LocationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("HasPokemon")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ImageId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<int?>("PokemonId")
                        .HasColumnType("INTEGER");

                    b.Property<double>("RocketChance")
                        .HasColumnType("REAL");

                    b.HasKey("LocationId");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.Pokemon", b =>
                {
                    b.Property<int>("PokemonId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Energy")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Health")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ImageId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.Property<int>("TypeId")
                        .HasColumnType("INTEGER");

                    b.HasKey("PokemonId");

                    b.ToTable("Pokemons");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.PokemonAttack", b =>
                {
                    b.Property<int>("PokemonAttackId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("AttackId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("PokemonId")
                        .HasColumnType("INTEGER");

                    b.HasKey("PokemonAttackId");

                    b.HasIndex("AttackId");

                    b.HasIndex("PokemonId");

                    b.ToTable("PokemonAttack");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.PokemonType", b =>
                {
                    b.Property<int>("TypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<double>("ToBug")
                        .HasColumnType("REAL");

                    b.Property<double>("ToDark")
                        .HasColumnType("REAL");

                    b.Property<double>("ToDragon")
                        .HasColumnType("REAL");

                    b.Property<double>("ToElectric")
                        .HasColumnType("REAL");

                    b.Property<double>("ToFairy")
                        .HasColumnType("REAL");

                    b.Property<double>("ToFighting")
                        .HasColumnType("REAL");

                    b.Property<double>("ToFire")
                        .HasColumnType("REAL");

                    b.Property<double>("ToFlying")
                        .HasColumnType("REAL");

                    b.Property<double>("ToGhost")
                        .HasColumnType("REAL");

                    b.Property<double>("ToGrass")
                        .HasColumnType("REAL");

                    b.Property<double>("ToGround")
                        .HasColumnType("REAL");

                    b.Property<double>("ToIce")
                        .HasColumnType("REAL");

                    b.Property<double>("ToNormal")
                        .HasColumnType("REAL");

                    b.Property<double>("ToPoison")
                        .HasColumnType("REAL");

                    b.Property<double>("ToPsychic")
                        .HasColumnType("REAL");

                    b.Property<double>("ToRock")
                        .HasColumnType("REAL");

                    b.Property<double>("ToSteel")
                        .HasColumnType("REAL");

                    b.Property<double>("ToWater")
                        .HasColumnType("REAL");

                    b.Property<string>("TypeIcon")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("TypeId");

                    b.ToTable("PokemonTypes");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.Connection", b =>
                {
                    b.HasOne("Pokebooook.Server.Models.Location", "LocationFrom")
                        .WithMany("ConnectionsFrom")
                        .HasForeignKey("LocationFromId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Pokebooook.Server.Models.Location", "LocationTo")
                        .WithMany("ConnectionsTo")
                        .HasForeignKey("LocationToId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("LocationFrom");

                    b.Navigation("LocationTo");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.PokemonAttack", b =>
                {
                    b.HasOne("Pokebooook.Server.Models.Attack", "Attack")
                        .WithMany()
                        .HasForeignKey("AttackId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Pokebooook.Server.Models.Pokemon", null)
                        .WithMany("PokemonAttacks")
                        .HasForeignKey("PokemonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Attack");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.Location", b =>
                {
                    b.Navigation("ConnectionsFrom");

                    b.Navigation("ConnectionsTo");
                });

            modelBuilder.Entity("Pokebooook.Server.Models.Pokemon", b =>
                {
                    b.Navigation("PokemonAttacks");
                });
#pragma warning restore 612, 618
        }
    }
}
