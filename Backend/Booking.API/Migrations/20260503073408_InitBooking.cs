using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Booking.API.Migrations
{
    /// <inheritdoc />
    public partial class InitBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bookings",
                columns: table => new
                {
                    booking_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    booking_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    total_payment = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    payment_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    payment_method = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookings", x => x.booking_id);
                });

            migrationBuilder.CreateTable(
                name: "tickets",
                columns: table => new
                {
                    ticket_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    booking_id = table.Column<int>(type: "integer", nullable: false),
                    showtime_id = table.Column<int>(type: "integer", nullable: false),
                    seat_number = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tickets", x => x.ticket_id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookings");

            migrationBuilder.DropTable(
                name: "tickets");
        }
    }
}
