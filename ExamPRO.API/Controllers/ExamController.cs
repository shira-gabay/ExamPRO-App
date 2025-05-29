using ExamPRO.API.Models;
using ExamPRO.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamPRO.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly ExamService _examService;
        private readonly AiService _aiService;
         private readonly IS3Service _s3Service;

        public ExamController(ExamService examService, AiService aiService, IS3Service s3Service)
        {
            _examService = examService;
            _aiService = aiService;
            _s3Service = s3Service;
        }

        [HttpGet]
        public async Task<List<Exam>> Get() =>
            await _examService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Exam>> GetById(string id)
        {
            var exam = await _examService.GetByIdAsync(id);
            if (exam is null) return NotFound();
            return exam;
        }
        [HttpGet("by-subject")]
        public async Task<IActionResult> GetBySubject([FromQuery] string subjectId)
        {
            if (string.IsNullOrEmpty(subjectId))
                return BadRequest("subjectId is required");

            try
            {
                var exams = await _examService.GetBySubjectIdAsync(subjectId);
                return Ok(exams);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Server error: {ex.Message}");
            }
        }
[HttpGet("stats/exams-per-subject")]
public async Task<IActionResult> GetExamsPerSubjectStats()
{
    try
    {
        var stats = await _examService.GetExamsGroupedBySubjectWithNamesAsync();

        var result = stats.Select(x => new
        {
            Subject = x.SubjectName,
            Count = x.Count
        });

        return Ok(result);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Server error: {ex.Message}");
    }
}



        [HttpPost]
        public async Task<IActionResult> Create(Exam exam)
        {
            await _examService.CreateAsync(exam);
            return CreatedAtAction(nameof(GetById), new { id = exam.Id }, exam);
        }


[HttpPost("generate")]
public async Task<IActionResult> GenerateExam(
    [FromForm] IFormFile file,
    [FromForm] string examType,
    [FromForm] string difficulty,
    [FromForm] int questionCount,
    [FromForm] int duration,
    [FromForm] string subject)
{
    if (file == null || file.Length == 0)
        return BadRequest("No file uploaded");

    var examData = new
    {
        ExamType = examType,
        Difficulty = difficulty,
        QuestionCount = questionCount,
        Duration = duration,
        Subject = subject
    };

    var generatedExamUrl = await _aiService.GenerateExamAsync(file, examData);

    if (generatedExamUrl.StartsWith("https://"))
    {
        var viewUrl = $"https://view.officeapps.live.com/op/view.aspx?src={System.Net.WebUtility.UrlEncode(generatedExamUrl)}";
        return Ok(new
        {
            downloadUrl = generatedExamUrl,
            viewUrl = viewUrl
        });
    }

    return Ok(generatedExamUrl);
}

   [HttpPost("{examId}/upload-study-material")]
    public async Task<IActionResult> UploadStudyMaterial(string examId, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        string fileName = GenerateFileName(file.FileName, examId, "study-materials");

        string fileUrl = await _s3Service.UploadFileAsync(file.OpenReadStream(), fileName);

        if (string.IsNullOrEmpty(fileUrl))
            return StatusCode(500, "Failed to upload file");

        // כאן עדיף להשתמש ב-ExamService לעדכון במסד
        var exam = await _examService.GetByIdAsync(examId);
        if (exam == null)
            return NotFound();

        exam.StudyMaterialUrls.Add(fileUrl);
        await _examService.UpdateAsync(examId, exam);

        return Ok(new { fileUrl });
    }

    private string GenerateFileName(string originalFileName, string examId, string folder)
    {
        var extension = Path.GetExtension(originalFileName);
        var uniqueName = $"{Guid.NewGuid()}{extension}";
        return $"{examId}/{folder}/{uniqueName}";
    }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Exam exam)
        {
            var existingExam = await _examService.GetByIdAsync(id);
            if (existingExam is null) return NotFound();

            exam.Id = id;
            await _examService.UpdateAsync(id, exam);
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var exam = await _examService.GetByIdAsync(id);
            if (exam is null) return NotFound();
            await _examService.DeleteAsync(id);
            return NoContent();
        }
    }
    
}
