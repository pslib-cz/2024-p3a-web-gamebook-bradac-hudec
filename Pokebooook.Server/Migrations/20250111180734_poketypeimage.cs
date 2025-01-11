using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class poketypeimage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TypeIcon",
                table: "PokemonTypes");

            migrationBuilder.AddColumn<int>(
                name: "ImageId",
                table: "PokemonTypes",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "PokemonTypes");

            migrationBuilder.AddColumn<string>(
                name: "TypeIcon",
                table: "PokemonTypes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
