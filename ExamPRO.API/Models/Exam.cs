using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace ExamPRO.API.Models
{
    public class Exam
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string TeacherId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string SubjectId { get; set; } = null!;

        [BsonElement("examFileUrls")]
        public List<string> ExamFileUrls { get; set; } = new(); 


[BsonElement("studyMaterialUrls")]
public List<string> StudyMaterialUrls { get; set; } = new(); 

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
