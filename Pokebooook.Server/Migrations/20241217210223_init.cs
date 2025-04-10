﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Attacks",
                columns: table => new
                {
                    AttackId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    EnergyCost = table.Column<double>(type: "REAL", nullable: false),
                    BaseDamage = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attacks", x => x.AttackId);
                });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ImageId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Data = table.Column<byte[]>(type: "BLOB", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.ImageId);
                });

            migrationBuilder.CreateTable(
                name: "Item",
                columns: table => new
                {
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    ImageId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Item", x => x.ItemId);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    LocationId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    HasPokemon = table.Column<bool>(type: "INTEGER", nullable: false),
                    RocketChance = table.Column<double>(type: "REAL", nullable: false),
                    PokemonId = table.Column<int>(type: "INTEGER", nullable: true),
                    ImageId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.LocationId);
                });

            migrationBuilder.CreateTable(
                name: "PokemonTypes",
                columns: table => new
                {
                    TypeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    TypeIcon = table.Column<string>(type: "TEXT", nullable: false),
                    ToGround = table.Column<double>(type: "REAL", nullable: false),
                    ToGrass = table.Column<double>(type: "REAL", nullable: false),
                    ToFire = table.Column<double>(type: "REAL", nullable: false),
                    ToWater = table.Column<double>(type: "REAL", nullable: false),
                    ToElectric = table.Column<double>(type: "REAL", nullable: false),
                    ToPsychic = table.Column<double>(type: "REAL", nullable: false),
                    ToFighting = table.Column<double>(type: "REAL", nullable: false),
                    ToPoison = table.Column<double>(type: "REAL", nullable: false),
                    ToFlying = table.Column<double>(type: "REAL", nullable: false),
                    ToBug = table.Column<double>(type: "REAL", nullable: false),
                    ToRock = table.Column<double>(type: "REAL", nullable: false),
                    ToGhost = table.Column<double>(type: "REAL", nullable: false),
                    ToDark = table.Column<double>(type: "REAL", nullable: false),
                    ToDragon = table.Column<double>(type: "REAL", nullable: false),
                    ToSteel = table.Column<double>(type: "REAL", nullable: false),
                    ToFairy = table.Column<double>(type: "REAL", nullable: false),
                    ToIce = table.Column<double>(type: "REAL", nullable: false),
                    ToNormal = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonTypes", x => x.TypeId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    IsAdmin = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Pokemons",
                columns: table => new
                {
                    PokemonId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Health = table.Column<int>(type: "INTEGER", nullable: false),
                    Energy = table.Column<int>(type: "INTEGER", nullable: true),
                    TypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageId = table.Column<int>(type: "INTEGER", nullable: true),
                    Attack1Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Attack2Id = table.Column<int>(type: "INTEGER", nullable: true),
                    Attack3Id = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pokemons", x => x.PokemonId);
                    table.ForeignKey(
                        name: "FK_Pokemons_Attacks_Attack1Id",
                        column: x => x.Attack1Id,
                        principalTable: "Attacks",
                        principalColumn: "AttackId");
                    table.ForeignKey(
                        name: "FK_Pokemons_Attacks_Attack2Id",
                        column: x => x.Attack2Id,
                        principalTable: "Attacks",
                        principalColumn: "AttackId");
                    table.ForeignKey(
                        name: "FK_Pokemons_Attacks_Attack3Id",
                        column: x => x.Attack3Id,
                        principalTable: "Attacks",
                        principalColumn: "AttackId");
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    ConnectionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LocationFromId = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationToId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connections", x => x.ConnectionId);
                    table.ForeignKey(
                        name: "FK_Connections_Locations_LocationFromId",
                        column: x => x.LocationFromId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Connections_Locations_LocationToId",
                        column: x => x.LocationToId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Connections_LocationFromId",
                table: "Connections",
                column: "LocationFromId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_LocationToId",
                table: "Connections",
                column: "LocationToId");

            migrationBuilder.CreateIndex(
                name: "IX_Pokemons_Attack1Id",
                table: "Pokemons",
                column: "Attack1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Pokemons_Attack2Id",
                table: "Pokemons",
                column: "Attack2Id");

            migrationBuilder.CreateIndex(
                name: "IX_Pokemons_Attack3Id",
                table: "Pokemons",
                column: "Attack3Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "Item");

            migrationBuilder.DropTable(
                name: "Pokemons");

            migrationBuilder.DropTable(
                name: "PokemonTypes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "Attacks");
        }
    }
}
