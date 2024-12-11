using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "ToBug",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToDark",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToDragon",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToElectric",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToFairy",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToFighting",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToFire",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToFlying",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToGhost",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToGrass",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToGround",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToIce",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToNormal",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToPoison",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToPsychic",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToRock",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToSteel",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ToWater",
                table: "PokemonTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ToBug",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToDark",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToDragon",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToElectric",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToFairy",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToFighting",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToFire",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToFlying",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToGhost",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToGrass",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToGround",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToIce",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToNormal",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToPoison",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToPsychic",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToRock",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToSteel",
                table: "PokemonTypes");

            migrationBuilder.DropColumn(
                name: "ToWater",
                table: "PokemonTypes");
        }
    }
}
