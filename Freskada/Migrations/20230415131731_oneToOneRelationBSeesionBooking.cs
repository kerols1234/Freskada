using Microsoft.EntityFrameworkCore.Migrations;

namespace Freskada.Migrations
{
    public partial class oneToOneRelationBSeesionBooking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BookingId",
                table: "Sessions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_BookingId",
                table: "Sessions",
                column: "BookingId",
                unique: true,
                filter: "[BookingId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Bookings_BookingId",
                table: "Sessions",
                column: "BookingId",
                principalTable: "Bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Bookings_BookingId",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Sessions_BookingId",
                table: "Sessions");

            migrationBuilder.DropColumn(
                name: "BookingId",
                table: "Sessions");
        }
    }
}
