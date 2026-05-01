using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "role",
                table: "users",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "userid", "email", "fullname", "password", "role", "username" },
                values: new object[] { 1, "admin@cinema.local", "System Administrator", "$2a$11$SoT3w4PvLhnOhn6TmW6qa.ilaccxZXn1y7i1JZKrEP2lH1DKxl6.m", "Admin", "admin" });

            migrationBuilder.CreateIndex(
                name: "IX_users_username",
                table: "users",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_users_username",
                table: "users");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "userid",
                keyValue: 1);

            migrationBuilder.AlterColumn<string>(
                name: "role",
                table: "users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);
        }
    }
}
