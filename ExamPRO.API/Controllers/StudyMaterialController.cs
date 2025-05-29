using ExamPRO.API.Models;
using ExamPRO.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamPRO.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudyMaterialController : ControllerBase
    {
        private readonly StudyMaterialService _studyMaterialService;
private readonly IS3Service _s3Service;
        public StudyMaterialController(StudyMaterialService studyMaterialService, IS3Service s3Service)
        {
            _studyMaterialService = studyMaterialService;
             _s3Service = s3Service;
        }

        [HttpGet]
        public async Task<List<StudyMaterial>> Get() =>
            await _studyMaterialService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<StudyMaterial>> GetById(string id)
        {
            var studyMaterial = await _studyMaterialService.GetByIdAsync(id);
            if (studyMaterial is null) return NotFound();
            return studyMaterial;
        }

        [HttpPost]
        public async Task<IActionResult> Create(StudyMaterial studyMaterial)
        {
            await _studyMaterialService.CreateAsync(studyMaterial);
            return CreatedAtAction(nameof(GetById), new { id = studyMaterial.Id }, studyMaterial);
        }

[HttpPost("upload")]
public async Task<IActionResult> UploadStudyMaterial(
    [FromForm] IFormFile file,
    [FromForm] string title,
    [FromForm] string teacherId,
    [FromForm] string subjectId)
{
    // בדיקות בסיסיות
    if (file == null || file.Length == 0)
    {
        Console.WriteLine("⛔ לא התקבל קובץ או שהקובץ ריק");
        return BadRequest("לא נבחר קובץ או שהקובץ ריק.");
    }

    if (string.IsNullOrEmpty(title) || string.IsNullOrEmpty(teacherId) || string.IsNullOrEmpty(subjectId))
    {
        Console.WriteLine("⛔ חסר מידע: title או teacherId או subjectId ריקים");
        return BadRequest("יש למלא את כל השדות: כותרת, מזהה מורה ומזהה מקצוע.");
    }

    try
    {
        Console.WriteLine($"📥 התחלת העלאת קובץ: {file.FileName}, תוכן: {file.ContentType}");

        using var stream = file.OpenReadStream();

        // העלאה ל-S3
        var s3Result = await _s3Service.UploadFileAsync(stream, file.FileName, file.ContentType);

        Console.WriteLine($"✅ העלאה ל-S3 הצליחה. כתובת הקובץ: {s3Result}");

  
await _studyMaterialService.CreateAsync(new StudyMaterial
{
    FileName = file.FileName,
    FileUrl = s3Result,
    Title = title,
    UploadedByTeacherId = teacherId,
    SubjectId = subjectId,
    CreatedAt = DateTime.UtcNow
});


        return Ok(new
        {
            Message = "הקובץ הועלה בהצלחה",
            FileUrl = s3Result
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ שגיאה בהעלאה ל-S3: {ex.Message}");
        return StatusCode(500, "אירעה שגיאה פנימית בעת שמירת הקובץ.");
    }
}



        [HttpPost("generate-exam")]
        public async Task<IActionResult> GenerateExam([FromForm] IFormFile file, [FromForm] string examType, [FromForm] string difficulty)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var exam = await _studyMaterialService.GenerateExamAsync(file, examType, difficulty);
            return Ok(exam);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, StudyMaterial studyMaterial)
        {
            var existingMaterial = await _studyMaterialService.GetByIdAsync(id);
            if (existingMaterial is null) return NotFound();
            studyMaterial.Id = id;
            await _studyMaterialService.UpdateAsync(id, studyMaterial);
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var studyMaterial = await _studyMaterialService.GetByIdAsync(id);
            if (studyMaterial is null) return NotFound();
            await _studyMaterialService.DeleteAsync(id);
            return NoContent();
        }
    }
}