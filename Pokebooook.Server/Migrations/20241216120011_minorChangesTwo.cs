using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class minorChangesTwo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pokemons_Images_ImageId",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Pokemons_ImageId",
                table: "Pokemons");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Pokemons_ImageId",
                table: "Pokemons",
                column: "ImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pokemons_Images_ImageId",
                table: "Pokemons",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "ImageId");
        }
    }
}
