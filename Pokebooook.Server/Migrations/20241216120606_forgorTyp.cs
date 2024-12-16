using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class forgorTyp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Pokemons_TypeId",
                table: "Pokemons",
                column: "TypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pokemons_PokemonTypes_TypeId",
                table: "Pokemons",
                column: "TypeId",
                principalTable: "PokemonTypes",
                principalColumn: "TypeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pokemons_PokemonTypes_TypeId",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Pokemons_TypeId",
                table: "Pokemons");
        }
    }
}
