namespace NotatAppApi.Models
{
    public class LectureCourse
    {
        public int LectureCourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<Sheet> Sheets { get; set; } = [];
    }
}