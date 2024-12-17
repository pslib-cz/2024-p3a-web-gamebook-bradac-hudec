using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class pokeattackDeletion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pokemons_Attacks_Attack1Id",
                table: "Pokemons");

            migrationBuilder.DropForeignKey(
                name: "FK_Pokemons_Attacks_Attack2Id",
                table: "Pokemons");

            migrationBuilder.DropForeignKey(
                name: "FK_Pokemons_Attacks_Attack3Id",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Pokemons_Attack1Id",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Pokemons_Attack2Id",
                table: "Pokemons");

            migrationBuilder.DropIndex(
                name: "IX_Pokemons_Attack3Id",
                table: "Pokemons");

            migrationBuilder.DropColumn(
                name: "Attack1Id",
                table: "Pokemons");

            migrationBuilder.DropColumn(
                name: "Attack2Id",
                table: "Pokemons");

            migrationBuilder.RenameColumn(
                name: "Attack3Id",
                table: "Pokemons",
                newName: "AttackId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AttackId",
                table: "Pokemons",
                newName: "Attack3Id");

            migrationBuilder.AddColumn<int>(
                name: "Attack1Id",
                table: "Pokemons",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Attack2Id",
                table: "Pokemons",
                type: "INTEGER",
                nullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Pokemons_Attacks_Attack1Id",
                table: "Pokemons",
                column: "Attack1Id",
                principalTable: "Attacks",
                principalColumn: "AttackId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pokemons_Attacks_Attack2Id",
                table: "Pokemons",
                column: "Attack2Id",
                principalTable: "Attacks",
                principalColumn: "AttackId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pokemons_Attacks_Attack3Id",
                table: "Pokemons",
                column: "Attack3Id",
                principalTable: "Attacks",
                principalColumn: "AttackId");
        }
    }
}
