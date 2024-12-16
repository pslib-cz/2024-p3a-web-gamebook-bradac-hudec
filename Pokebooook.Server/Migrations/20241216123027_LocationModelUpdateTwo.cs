using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pokebooook.Server.Migrations
{
    /// <inheritdoc />
    public partial class LocationModelUpdateTwo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocationId1",
                table: "Locations",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Locations_LocationId1",
                table: "Locations",
                column: "LocationId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Locations_LocationId1",
                table: "Locations",
                column: "LocationId1",
                principalTable: "Locations",
                principalColumn: "LocationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Locations_LocationId1",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_LocationId1",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "LocationId1",
                table: "Locations");
        }
    }
}
