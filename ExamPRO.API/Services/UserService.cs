using ExamPRO.API.Models;
using ExamPRO.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamPRO.API.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserService(IOptions<MongoDbSettings> dbSettings)
        {
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _usersCollection = database.GetCollection<User>("Users");
        }

        public async Task<List<User>> GetAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        public async Task<User?> GetByIdAsync(string id)
        {
            var objectId = new ObjectId(id);
            return await _usersCollection.Find(x => x.Id == objectId.ToString()).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(User user) =>
            await _usersCollection.InsertOneAsync(user);

        public async Task UpdateAsync(string id, User user)
        {
            var objectId = new ObjectId(id);
            await _usersCollection.ReplaceOneAsync(x => x.Id == objectId.ToString(), user);
        }

        public async Task DeleteAsync(string id)
        {
            var objectId = new ObjectId(id);
            await _usersCollection.DeleteOneAsync(x => x.Id == objectId.ToString());
        }

        public async Task<User?> GetByUsernameAsync(string username) =>
            await _usersCollection.Find(user => user.FullName == username).FirstOrDefaultAsync();

        public async Task<User?> GetByEmailAsync(string email) =>
            await _usersCollection.Find(user => user.Email == email).FirstOrDefaultAsync();
    }
}
