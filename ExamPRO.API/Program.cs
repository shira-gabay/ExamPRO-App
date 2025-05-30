using ExamPRO.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text;
using Microsoft.Extensions.Options;
using ExamPRO.API.Settings;



// DotEnv רק לפיתוח מקומי
if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
{
    Console.WriteLine("Environment: Development");
    DotNetEnv.Env.Load();
}
else
{
    Console.WriteLine("Environment: Production");
}

var builder = WebApplication.CreateBuilder(args);

// חובה להוסיף את משתני הסביבה לקונפיגורציה
builder.Configuration.AddEnvironmentVariables();

// אופציונלי - הדפסת כל המשתנים כדי לוודא טעינה
foreach (var kvp in builder.Configuration.AsEnumerable())
{
    Console.WriteLine($"CONFIG: {kvp.Key} = {kvp.Value}");
}
foreach (var env in Environment.GetEnvironmentVariables().Keys)
{
    Console.WriteLine($"ENV: {env} = {Environment.GetEnvironmentVariable(env.ToString())}");
}

// 🔍 לוגים: בדיקת כל הקונפיגורציה הקריטית
Console.WriteLine("=== CONFIGURATION CHECK ===");

// קח קודם את משתנה הסביבה MONGO_CONNECTION ואם אין, נסה מהקונפיגורציה
var mongoConnection = Environment.GetEnvironmentVariable("MONGO_CONNECTION") 
                      ?? builder.Configuration["MONGO_CONNECTION"];

Console.WriteLine($"MONGO_CONNECTION => {mongoConnection}");

// ככה משתנה סביבה עם __ הופך ל- MongoDbSettings:DatabaseName בקונפיגורציה
var mongoDatabaseName = Environment.GetEnvironmentVariable("MongoDbSettings__DatabaseName") 
                        ?? builder.Configuration["MongoDbSettings:DatabaseName"];

Console.WriteLine($"MongoDbSettings__DatabaseName => {mongoDatabaseName}");
Console.WriteLine($"JwtSettings:SecretKey => {(string.IsNullOrEmpty(builder.Configuration["JwtSettings:SecretKey"]) ? "❌ MISSING" : "✅ PRESENT")}");
Console.WriteLine("============================");

// חובה שיהיה מחרוזת חיבור
if (string.IsNullOrEmpty(mongoConnection))
{
    throw new Exception("Missing MongoDB connection string (MONGO_CONNECTION).");
}

// ברירת מחדל לשם מסד הנתונים
if (string.IsNullOrEmpty(mongoDatabaseName))
{
    mongoDatabaseName = "ExamPRO";
    Console.WriteLine("Using default database name: ExamPRO");
}

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    Console.WriteLine("🟡 Loading MongoDB settings...");
    Console.WriteLine($"🔐 MONGO_CONNECTION: {mongoConnection}");

    return new MongoClient(mongoConnection);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    Console.WriteLine($"✅ Creating MongoDatabase with name: {mongoDatabaseName}");
    return client.GetDatabase(mongoDatabaseName);
});


// JWT
var secretKey = builder.Configuration["JwtSettings:SecretKey"];
if (string.IsNullOrEmpty(secretKey))
{
    Console.WriteLine("❌ JWT Secret Key is missing!");
    throw new Exception("JWT Secret Key is missing from configuration.");
}
else
{
    Console.WriteLine("✅ JWT Secret Key loaded.");
}
var key = Encoding.UTF8.GetBytes(secretKey);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// Services
builder.Services.AddSingleton<ExamService>();
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<StudyMaterialService>();
builder.Services.AddSingleton<SubjectCategoryService>();
builder.Services.AddHttpClient<AiService>();
builder.Services.AddSingleton<AiService>();
builder.Services.AddSingleton<IS3Service, S3Service>();
builder.Services.AddSingleton<S3Service>();
builder.Services.AddSingleton<JwtService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ExamPRO API", Version = "v1" });
    c.OperationFilter<FileUploadOperationFilter>();
});

var app = builder.Build();

// Middleware
app.UseCors("AllowAll");
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

Console.WriteLine("🚀 App is starting...");
app.Run();