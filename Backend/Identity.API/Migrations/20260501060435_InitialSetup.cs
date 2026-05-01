using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "userid",
                keyValue: 1,
                column: "password",
                value: "$2a$11$KK40/f1RMYeN3/BfXv/G2eWoYEUZijbEhy.C.qILqaSIcXD0QFZQC");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "userid",
                keyValue: 1,
                column: "password",
                value: "$2a$11$SoT3w4PvLhnOhn6TmW6qa.ilaccxZXn1y7i1JZKrEP2lH1DKxl6.m");
        }
    }
}
