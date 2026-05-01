using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Cast.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "actors",
                columns: table => new
                {
                    actor_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    actor_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    avatar_url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    bio = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_actors", x => x.actor_id);
                });

            migrationBuilder.CreateTable(
                name: "directors",
                columns: table => new
                {
                    director_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    director_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    avatar_url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    bio = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_directors", x => x.director_id);
                });

            migrationBuilder.CreateTable(
                name: "movie_actor",
                columns: table => new
                {
                    movie_id = table.Column<int>(type: "integer", nullable: false),
                    actor_id = table.Column<int>(type: "integer", nullable: false),
                    character_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movie_actor", x => new { x.movie_id, x.actor_id });
                });

            migrationBuilder.CreateTable(
                name: "movie_director",
                columns: table => new
                {
                    movie_id = table.Column<int>(type: "integer", nullable: false),
                    director_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movie_director", x => new { x.movie_id, x.director_id });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "actors");

            migrationBuilder.DropTable(
                name: "directors");

            migrationBuilder.DropTable(
                name: "movie_actor");

            migrationBuilder.DropTable(
                name: "movie_director");
        }
    }
}
