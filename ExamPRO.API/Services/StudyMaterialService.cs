using ExamPRO.API.Models;
using ExamPRO.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using MongoDB.Bson;

namespace ExamPRO.API.Services
{
    public class StudyMaterialService
    {
        private readonly IMongoCollection<StudyMaterial> _studyMaterialsCollection;
        private readonly S3Service _s3Service;

        public StudyMaterialService(IOptions<MongoDbSettings> dbSettings, S3Service s3Service)
        {
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _studyMaterialsCollection = database.GetCollection<StudyMaterial>("StudyMaterials");
            _s3Service = s3Service;
        }

        public async Task<List<StudyMaterial>> GetAsync() =>
            await _studyMaterialsCollection.Find(_ => true).ToListAsync();

        public async Task<StudyMaterial?> GetByIdAsync(string id) =>
            await _studyMaterialsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(StudyMaterial studyMaterial) =>
            await _studyMaterialsCollection.InsertOneAsync(studyMaterial);

        public async Task UpdateAsync(string id, StudyMaterial studyMaterial) {
              var objectId = new ObjectId(id);
            await _studyMaterialsCollection.ReplaceOneAsync(x => x.Id == objectId.ToString(), studyMaterial);
}
        public async Task DeleteAsync(string id){
              var objectId = new ObjectId(id);
            await _studyMaterialsCollection.DeleteOneAsync(x => x.Id == objectId.ToString());
}
        public async Task<string> UploadFileAsync(IFormFile file, string title, string teacherId, string subjectId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid file");

            using var stream = file.OpenReadStream();
            var contentType = file.ContentType ?? "application/octet-stream";
            var fileUrl = await _s3Service.UploadFileAsync(stream, file.FileName, contentType);

            
            var studyMaterial = new StudyMaterial
            {
                FileName = file.FileName,
                FileUrl = fileUrl, // שמירת ה-URL של S3
                CreatedAt = DateTime.UtcNow,
                Title = title,
                UploadedByTeacherId = teacherId,
                SubjectId = subjectId
            };

            await _studyMaterialsCollection.InsertOneAsync(studyMaterial);
            return fileUrl;
        }

        public async Task<object> GenerateExamAsync(IFormFile file, string examType, string difficulty)
        {
            if (file == null || file.Length == 0)
                return new { Error = "Invalid file" };

            // 1️⃣ שמירת הקובץ באופן זמני
            var filePath = Path.GetTempFileName();
            try
            {
                await using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // 2️⃣ שליחת הנתונים ל-AI
                var requestBody = new
                {
                    ExamType = examType,
                    Difficulty = difficulty,
                    FilePath = filePath // בהמשך אפשר לשלוח ישירות את התוכן
                };

                using var client = new HttpClient();
                var response = await client.PostAsJsonAsync("http://localhost:5279/generate-exam", requestBody);

                if (!response.IsSuccessStatusCode)
                {
                    return new { Error = "Failed to generate exam", StatusCode = response.StatusCode };
                }

                var exam = await response.Content.ReadFromJsonAsync<object>();
                return exam ?? new { Error = "Empty response from AI service" };
            }
            catch (Exception ex)
            {
                return new { Error = $"Error generating exam: {ex.Message}" };
            }
            finally
            {
                // 3️⃣ מחיקת הקובץ הזמני
                if (File.Exists(filePath))
                    File.Delete(filePath);
            }
        }
    }
}