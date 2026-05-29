using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Booking.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUniqueContraits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_tickets_showtime_id_seat_number",
                table: "tickets",
                columns: new[] { "showtime_id", "seat_number" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_tickets_showtime_id_seat_number",
                table: "tickets");
        }
    }
}
