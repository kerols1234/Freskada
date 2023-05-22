using Microsoft.EntityFrameworkCore.Migrations;

namespace Freskada.Migrations
{
    public partial class addPriceToSessionMaterial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Price",
                table: "SessionMaterials",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "SessionMaterials");
        }
    }
}
