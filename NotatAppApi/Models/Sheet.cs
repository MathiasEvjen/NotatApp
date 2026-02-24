namespace NotatAppApi.Models
{
    public class Sheet
    {
        public int SheetId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}