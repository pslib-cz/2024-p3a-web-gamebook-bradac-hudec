using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class revertingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Pokemons_ImageId",
                table: "Pokemons",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_ImageId",
                table: "Locations",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_PokemonId",
                table: "Locations",
                column: "PokemonId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_LocationFromId",
                table: "Connections",
                column: "LocationFromId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_LocationToId",
                table: "Connections",
                column: "LocationToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Locations_LocationFromId",
                table: "Connections",
                column: "LocationFromId",
                principalTable: "Locations",
                principalColumn: "LocationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Locations_LocationToId",
                table: "Connections",
                column: "LocationToId",
                principalTable: "Locations",
                principalColumn: "LocationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Images_ImageId",
                table: "Locations",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "ImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Pokemons_PokemonId",
                table: "Locations",
                column: "PokemonId",
                principalTable: "Pokemons",
                principalColumn: "PokedexId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pokemons_Images_ImageId",
                table: "Pokemons",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "ImageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Locations_LocationFromId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Locations_LocationToId",
                table: "Connections");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Images_ImageId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Pokemons_PokemonId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Pokemons_Images_ImageId",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Pokemons_ImageId",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Locations_ImageId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_PokemonId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Connections_LocationFromId",
                table: "Connections");

            migrationBuilder.DropIndex(
                name: "IX_Connections_LocationToId",
                table: "Connections");
        }
    }
}
