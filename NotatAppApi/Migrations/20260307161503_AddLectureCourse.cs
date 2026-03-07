using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NotatAppApi.Migrations
{
    /// <inheritdoc />
    public partial class AddLectureCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Sheets",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "EditedAt",
                table: "Sheets",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<int>(
                name: "LectureCourseId",
                table: "Sheets",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NoteType",
                table: "Sheets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "LectureCourses",
                columns: table => new
                {
                    LectureCourseId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LectureCourses", x => x.LectureCourseId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sheets_LectureCourseId",
                table: "Sheets",
                column: "LectureCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sheets_LectureCourses_LectureCourseId",
                table: "Sheets",
                column: "LectureCourseId",
                principalTable: "LectureCourses",
                principalColumn: "LectureCourseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sheets_LectureCourses_LectureCourseId",
                table: "Sheets");

            migrationBuilder.DropTable(
                name: "LectureCourses");

            migrationBuilder.DropIndex(
                name: "IX_Sheets_LectureCourseId",
                table: "Sheets");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Sheets");

            migrationBuilder.DropColumn(
                name: "EditedAt",
                table: "Sheets");

            migrationBuilder.DropColumn(
                name: "LectureCourseId",
                table: "Sheets");

            migrationBuilder.DropColumn(
                name: "NoteType",
                table: "Sheets");
        }
    }
}
