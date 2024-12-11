using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class Location : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    LocationId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Paths = table.Column<string>(type: "TEXT", nullable: false),
                    PokemonPokedexId = table.Column<int>(type: "INTEGER", nullable: true),
                    RocketChance = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.LocationId);
                    table.ForeignKey(
                        name: "FK_Locations_Pokemons_PokemonPokedexId",
                        column: x => x.PokemonPokedexId,
                        principalTable: "Pokemons",
                        principalColumn: "PokedexId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Locations_PokemonPokedexId",
                table: "Locations",
                column: "PokemonPokedexId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Locations");
        }
    }
}
