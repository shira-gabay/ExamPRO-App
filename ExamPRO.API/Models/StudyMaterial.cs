using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace ExamPRO.API.Models
{
    public class StudyMaterial
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("fileName")]
        public string FileName { get; set; } = null!; // שם הקובץ

        [BsonElement("fileUrl")]
        public string FileUrl { get; set; } = null!; // כתובת URL לקובץ ב-S3

        [BsonElement("uploadedByTeacherId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UploadedByTeacherId { get; set; } = null!; // מזהה המורה שהעלה

        [BsonElement("subjectId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string SubjectId { get; set; } = null!; // מזהה המקצוע

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("title")]
        public string Title { get; set; } = null!;
    }
}