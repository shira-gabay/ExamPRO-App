namespace ExamPRO.API.Models.Requests
{
    public class GenerateExamRequest
    {
        public string Title { get; set; } = null!;
        public string TeacherId { get; set; } = null!;
        public string SubjectId { get; set; } = null!;
        public string FileUrl { get; set; } = null!;
        public string ExamType { get; set; } = null!;
        public string Difficulty { get; set; } = null!;

    }
}
