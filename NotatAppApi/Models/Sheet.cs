namespace NotatAppApi.Models
{
    public class Sheet
    {
        public int SheetId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string NoteType { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset EditedAt { get; set; }


        public int? LectureCourseId { get; set; }
        public LectureCourse? LectureCourse { get; set; }
    }
}