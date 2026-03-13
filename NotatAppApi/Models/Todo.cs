namespace NotatAppApi.Models
{
    public class Todo
    {
        public int TodoId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
    }
}