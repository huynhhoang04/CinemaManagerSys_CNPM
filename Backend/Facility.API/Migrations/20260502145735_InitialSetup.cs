using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Facility.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "room",
                columns: table => new
                {
                    room_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    theatre_id = table.Column<int>(type: "integer", nullable: false),
                    room_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    room_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    capacity = table.Column<int>(type: "integer", nullable: false),
                    room_status = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_room", x => x.room_id);
                });

            migrationBuilder.CreateTable(
                name: "theatres",
                columns: table => new
                {
                    theatre_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    theatre_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    location = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    preview_url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    info = table.Column<string>(type: "text", nullable: false),
                    theatre_status = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    city = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    coordinates = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_theatres", x => x.theatre_id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "room");

            migrationBuilder.DropTable(
                name: "theatres");
        }
    }
}
