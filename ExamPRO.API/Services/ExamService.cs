using ExamPRO.API.Models;
using ExamPRO.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExamPRO.API.Services
{
    public class ExamService
    {
        private readonly IMongoCollection<Exam> _examsCollection;
private readonly IMongoCollection<SubjectCategory> _subjectsCollection;

        public ExamService(IOptions<MongoDbSettings> dbSettings)
        {
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _examsCollection = database.GetCollection<Exam>("Exams");
            _subjectsCollection = database.GetCollection<SubjectCategory>("SubjectCategories");


        }

        public async Task<List<Exam>> GetAsync() =>
            await _examsCollection.Find(_ => true).ToListAsync();

        public async Task<Exam?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;

            return await _examsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Exam exam) =>
            await _examsCollection.InsertOneAsync(exam);
public async Task<List<Exam>> GetBySubjectIdAsync(string subjectId)
{
    return await _examsCollection.Find(x => x.SubjectId == subjectId).ToListAsync();
}
public async Task<List<(string SubjectName, int Count)>> GetExamsGroupedBySubjectWithNamesAsync()
{
    var exams = await _examsCollection.Find(_ => true).ToListAsync();
  var grouped = exams
    .Where(e => !string.IsNullOrWhiteSpace(e.SubjectId))
    .GroupBy(e => e.SubjectId.ToString());
   var subjectsCursor = await _subjectsCollection.FindAsync(_ => true);
var subjects = await subjectsCursor.ToListAsync();

Console.WriteLine("🔎 Loaded subjects:");
foreach (var s in subjects)
{
    Console.WriteLine($"🧪 Subject ID: {s.Id}, Name: {s.Name}");
}

    var subjectDict = subjects.ToDictionary(s => s.Id.ToString(), s => s.Name);
   var result = grouped.Select(g =>
{
    Console.WriteLine($"🔍 Group Key: {g.Key}");
    foreach (var s in subjects)
    {
        var match = s.Id.ToString() == g.Key;
        Console.WriteLine($"🔄 Compare {s.Id} == {g.Key} ? {match}");
    }

    var subject = subjects.FirstOrDefault(s => s.Id.ToString() == g.Key);
    Console.WriteLine("🎯 נמצא מקצוע?", subject != null);

    var subjectName = subject?.Name ?? "לא ידוע";
    return (SubjectName: subjectName, Count: g.Count());
}).ToList();

    var missingSubjectIds = grouped
        .Where(g => !subjectDict.ContainsKey(g.Key))
        .Select(g => g.Key)
        .ToList();

    Console.WriteLine("=== MISSING SUBJECT IDs ===");
    foreach (var id in missingSubjectIds)
    {
        Console.WriteLine(id);
    }
    Console.WriteLine("=== EXAMS ===");
foreach (var e in exams)
{
    Console.WriteLine($"Exam ID: {e.Id}, SubjectId: {e.SubjectId}, Type: {e.SubjectId?.GetType()}");
}

Console.WriteLine("=== SUBJECTS ===");
foreach (var s in subjects)
{
    Console.WriteLine($"Subject ID: {s.Id}, Name: {s.Name}, Type: {s.Id?.GetType()}");
}


    return result;
}




        public async Task UpdateAsync(string id, Exam exam) =>
            await _examsCollection.ReplaceOneAsync(x => x.Id == id, exam);

        public async Task DeleteAsync(string id) =>
            await _examsCollection.DeleteOneAsync(x => x.Id == id);
    }
}
