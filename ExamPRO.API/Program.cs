using ExamPRO.API.Settings;
using ExamPRO.API.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;

using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using DotNetEnv;

Env.Load(); // טוען את קובץ ה-ENV

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://+:80");
// טעינת הגדרות MongoDB מתוך קובץ התצורה (appsettings.json)
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

// קבלת מפתח סודי מתוך קובץ התצורה
var secretKey = builder.Configuration["JwtSettings:SecretKey"];
if (string.IsNullOrEmpty(secretKey))
{
    throw new Exception("JWT Secret Key is missing from configuration.");
}

var key = Encoding.UTF8.GetBytes(secretKey);

// הגדרת אימות באמצעות JWT
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

// חיבור ל-MongoDB
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

// רישום שירותים (Dependency Injection)
builder.Services.AddSingleton<ExamService>();
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<StudyMaterialService>();
builder.Services.AddSingleton<SubjectCategoryService>();
builder.Services.AddHttpClient<AiService>();
builder.Services.AddSingleton<AiService>();
builder.Services.AddSingleton<IS3Service, S3Service>();
builder.Services.AddSingleton<S3Service>();
builder.Services.AddSingleton<JwtService>();



// הגדרת CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// הוספת שירותי API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// הוספת Swagger עם תמיכה בהעלאת קבצים
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ExamPRO API", Version = "v1" });
    c.OperationFilter<FileUploadOperationFilter>();  // ✅ מאפשר העלאת קבצים
});

var app = builder.Build();

// סדר Middleware נכון
app.UseCors("AllowAll");


    app.UseSwagger();
    app.UseSwaggerUI();


app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
