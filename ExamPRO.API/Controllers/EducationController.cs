using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ExamPRO.API.Models;

namespace ExamPRO.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EducationController : ControllerBase
    {
        private readonly IMongoCollection<SubjectCategory> _subjectCategoriesCollection;

        public EducationController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("ExamPRO");
            _subjectCategoriesCollection = database.GetCollection<SubjectCategory>("SubjectCategories");
        }

        [HttpGet("subject-categories")]
        public async Task<IActionResult> GetSubjectCategoriesAsync()
        {
            var categories = await _subjectCategoriesCollection.Find(_ => true).ToListAsync();
            return Ok(categories);
        }
    }
}
