using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Facility.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "theatres",
                columns: table => new
                {
                    theatre_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    theatre_name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    location = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    coordinates = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    preview_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    info = table.Column<string>(type: "text", nullable: false),
                    theatre_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Active"),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_theatres", x => x.theatre_id);
                });

            migrationBuilder.CreateTable(
                name: "rooms",
                columns: table => new
                {
                    room_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    theatre_id = table.Column<int>(type: "integer", nullable: false),
                    room_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    room_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    capacity = table.Column<int>(type: "integer", nullable: false),
                    room_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Active")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rooms", x => x.room_id);
                    table.ForeignKey(
                        name: "FK_rooms_theatres_theatre_id",
                        column: x => x.theatre_id,
                        principalTable: "theatres",
                        principalColumn: "theatre_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "theatres",
                columns: new[] { "theatre_id", "theatre_name", "location", "coordinates", "preview_url", "info", "theatre_status", "city" },
                values: new object[,]
                {
                    { 1, "CGV Vincom Center", "Tầng 5, Vincom Center, 72 Lê Thánh Tôn, Q.1, TP.HCM", "10.7769,106.7009", "", "Cụm rạp cao cấp tại trung tâm Quận 1", "Active", "Hồ Chí Minh" },
                    { 2, "CGV Aeon Mall Tân Phú", "Tầng 3, Aeon Mall Tân Phú, 30 Bờ Bao Tân Thắng, Q.Tân Phú, TP.HCM", "10.8018,106.6180", "", "Cụm rạp lớn tại khu vực Tân Phú", "Active", "Hồ Chí Minh" },
                    { 3, "Lotte Cinema Nowzone", "Tầng 5, Nowzone, 235 Nguyễn Văn Cừ, Q.1, TP.HCM", "10.7622,106.6882", "", "Rạp chiếu phim hiện đại tại Nowzone", "Active", "Hồ Chí Minh" }
                });

            migrationBuilder.InsertData(
                table: "rooms",
                columns: new[] { "room_id", "theatre_id", "room_name", "room_type", "capacity", "room_status" },
                values: new object[,]
                {
                    { 1, 1, "Phòng 1", "2D", 120, "Active" },
                    { 2, 1, "Phòng 2", "3D", 100, "Active" },
                    { 3, 1, "Phòng IMAX", "IMAX", 200, "Active" },
                    { 4, 2, "Phòng 1", "2D", 150, "Active" },
                    { 5, 2, "Phòng 4DX", "4DX", 80, "Active" },
                    { 6, 3, "Phòng A", "2D", 130, "Active" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_rooms_theatre_id",
                table: "rooms",
                column: "theatre_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "rooms");
            migrationBuilder.DropTable(name: "theatres");
        }
    }
}
