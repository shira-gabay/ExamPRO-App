using ExamPRO.API.Models;
using ExamPRO.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamPRO.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectCategoryController : ControllerBase
    {
        private readonly SubjectCategoryService _subjectCategoryService;

        public SubjectCategoryController(SubjectCategoryService subjectCategoryService)
        {
            _subjectCategoryService = subjectCategoryService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SubjectCategory>>> Get() =>
            await _subjectCategoryService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<SubjectCategory>> GetById(string id)
        {
            var category = await _subjectCategoryService.GetByIdAsync(id);
            if (category == null) return NotFound();
            return category;
        }

[HttpPost]
public async Task<IActionResult> Create([FromBody] SubjectCategoryCreateDto dto)
{
    try
    {
        var category = new SubjectCategory
        {
            Name = dto.Name,
            CreatedAt = DateTime.UtcNow
        };

        await _subjectCategoryService.CreateAsync(category);

        // כאן את בודקת אם אחרי ההכנסה ה-ID קיים
        if (string.IsNullOrEmpty(category.Id))
            return StatusCode(500, "MongoDB did not generate an ID.");

        return Ok(category); // אפשר גם Created, אם תרצי
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Failed to create category: {ex.Message}");
    }
}




        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, SubjectCategory category)
        {
            var existing = await _subjectCategoryService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            category.Id = id;
            await _subjectCategoryService.UpdateAsync(id, category);
            return NoContent();
        }

   [HttpDelete("{id:length(24)}")]
public async Task<IActionResult> Delete(string id)
{
    try
    {
        var existing = await _subjectCategoryService.GetByIdAsync(id);
        if (existing == null) return NotFound();

        await _subjectCategoryService.DeleteAsync(id);
        return NoContent();
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}

    }
}
