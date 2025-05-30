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

// 🔍 לוגים: בדיקת כל הקונפיגורציה הקריטית
Console.WriteLine("=== CONFIGURATION CHECK ===");
Console.WriteLine($"MONGO_CONNECTION => {builder.Configuration["MONGO_CONNECTION"]}");
Console.WriteLine($"MongoDbSettings__DatabaseName => {builder.Configuration["MongoDbSettings__DatabaseName"]}");
Console.WriteLine($"JwtSettings:SecretKey => {(string.IsNullOrEmpty(builder.Configuration["JwtSettings:SecretKey"]) ? "❌ MISSING" : "✅ PRESENT")}");
Console.WriteLine("============================");
Console.WriteLine($"🔍 DB from Env: '{Environment.GetEnvironmentVariable("MongoDbSettings__DatabaseName")}'");
Console.WriteLine($"🔍 DB from Config: '{builder.Configuration["MongoDbSettings__DatabaseName"]}'");

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration["MONGO_CONNECTION"];
    var dbName = configuration["MongoDbSettings__DatabaseName"];

    Console.WriteLine("🟡 Loading MongoDB settings...");
    Console.WriteLine($"🔐 MONGO_CONNECTION: {connectionString}");
    Console.WriteLine($"📂 MongoDbSettings__DatabaseName: {dbName}");

    if (string.IsNullOrEmpty(connectionString))
    {
        Console.WriteLine("❌ ERROR: MONGO_CONNECTION is missing.");
        throw new Exception("Missing MongoDB connection string.");
    }

    return new MongoClient(connectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var databaseName = configuration["MongoDbSettings__DatabaseName"];
    if (string.IsNullOrEmpty(databaseName))
    {
        Console.WriteLine("❌ ERROR: Database name is missing.");
        throw new Exception("Missing MongoDB database name.");
    }

    var client = sp.GetRequiredService<IMongoClient>();
    Console.WriteLine($"✅ Creating MongoDatabase with name: {databaseName}");
    return client.GetDatabase(databaseName);
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
