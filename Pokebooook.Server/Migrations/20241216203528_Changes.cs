using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class Changes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "FK_Locations_Locations_LocationId1",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Pokemons_PokemonId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Pokemons_Images_ImageId",
                table: "Pokemons");

            migrationBuilder.DropForeignKey(
                name: "FK_Pokemons_PokemonTypes_TypeId",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Pokemons_ImageId",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Pokemons_TypeId",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Locations_ImageId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_LocationId1",
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

            migrationBuilder.RenameColumn(
                name: "LocationId1",
                table: "Locations",
                newName: "ConnectionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ConnectionId",
                table: "Locations",
                newName: "LocationId1");

            migrationBuilder.CreateIndex(
                name: "IX_Pokemons_ImageId",
                table: "Pokemons",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Pokemons_TypeId",
                table: "Pokemons",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_ImageId",
                table: "Locations",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_LocationId1",
                table: "Locations",
                column: "LocationId1");

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
                name: "FK_Locations_Locations_LocationId1",
                table: "Locations",
                column: "LocationId1",
                principalTable: "Locations",
                principalColumn: "LocationId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Pokemons_PokemonTypes_TypeId",
                table: "Pokemons",
                column: "TypeId",
                principalTable: "PokemonTypes",
                principalColumn: "TypeId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
