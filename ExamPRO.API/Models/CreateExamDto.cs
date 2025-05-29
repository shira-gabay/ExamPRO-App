public class CreateExamDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string SubjectId { get; set; }
    public string TeacherId { get; set; }
    public List<string> ExamFileUrls { get; set; }
    public List<string> StudyMaterialUrls { get; set; }
}
