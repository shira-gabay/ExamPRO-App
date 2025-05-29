using ExamPRO.API.Models;
using ExamPRO.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamPRO.API.Services
{
    public class SubjectCategoryService
    {
        private readonly IMongoCollection<SubjectCategory> _categoriesCollection;

        public SubjectCategoryService(IOptions<MongoDbSettings> dbSettings)
        {
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _categoriesCollection = database.GetCollection<SubjectCategory>("SubjectCategories");
        }

        public async Task<List<SubjectCategory>> GetAsync() =>
            await _categoriesCollection.Find(_ => true).ToListAsync();

        public async Task<SubjectCategory?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
                return null;

            return await _categoriesCollection.Find(x => x.Id == objectId.ToString()).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(SubjectCategory category) =>
            await _categoriesCollection.InsertOneAsync(category);

        public async Task UpdateAsync(string id, SubjectCategory category)
        {
            await _categoriesCollection.ReplaceOneAsync(x => x.Id == id, category);
        }

        public async Task DeleteAsync(string id)
        {
            await _categoriesCollection.DeleteOneAsync(x => x.Id == id);
        }
    }
}
