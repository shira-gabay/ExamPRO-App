using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Linq;

namespace ExamPRO.API.Services
{
    public class AiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _openAiApiKey;
        private readonly S3Service _s3Service;

        private const string OpenAiUrl = "https://api.openai.com/v1/chat/completions";
        private const string DefaultModel = "gpt-4o-mini";

        public AiService(HttpClient httpClient, IConfiguration configuration, S3Service s3Service)
        {
            _httpClient = httpClient;
            _openAiApiKey = configuration["OpenAI:ApiKey"];
            _s3Service = s3Service;

            if (string.IsNullOrEmpty(_openAiApiKey))
                throw new Exception("OpenAI API key is missing in configuration.");
        }

public async Task<string> GenerateExamAsync(IFormFile file, object examData)
{
    string fileContent;

    if (file.FileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase))
    {
        // קריאה מתוך קובץ Word
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        using var wordDoc = WordprocessingDocument.Open(memoryStream, false);

        var body = wordDoc.MainDocumentPart?.Document?.Body;
        fileContent = body == null ? string.Empty : string.Join("\n", body.Elements<Paragraph>().Select(p => p.InnerText));
    }
    else
    {
        // קריאה רגילה לקובצי טקסט
        using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8);
        fileContent = await reader.ReadToEndAsync();
    }

    if (string.IsNullOrWhiteSpace(fileContent))
        return "❌ הקובץ ריק או לא קריא.";

    // --- שליחת הבקשה ל-AI --- //
    var requestBody = new
    {
        model = DefaultModel,
        messages = new[]
        {
            new { role = "system", content = "אתה עוזר ביצירת מבחנים מחומרי לימוד. צור מבחן ברור, מדויק ומעוצב בהתאם להנחיות." },
            new { role = "user", content = $"חומר לימוד:\n{fileContent}\n\nמסננים:\n{JsonSerializer.Serialize(examData)}" }
        },
        max_tokens = 1500,
        temperature = 0.7,
        top_p = 1.0
    };

    // (שאר הקוד שלך ליצירת הבקשה, עיבוד הפלט, ושמירה ב-S3 – ללא שינוי)


            var requestJson = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            using var request = new HttpRequestMessage(HttpMethod.Post, OpenAiUrl);
            request.Headers.Add("Authorization", $"Bearer {_openAiApiKey}");
            request.Content = requestJson;

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                return $"Error: OpenAI API failed with status {response.StatusCode} - {errorMessage}";
            }

            var resultJson = await response.Content.ReadAsStringAsync();

            try
            {
                using var doc = JsonDocument.Parse(resultJson);
                var content = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                if (string.IsNullOrEmpty(content))
                    return "❌ No valid response from AI.";

                using var memoryStream = new MemoryStream();

                using (var wordDoc = WordprocessingDocument.Create(memoryStream, DocumentFormat.OpenXml.WordprocessingDocumentType.Document, true))
                {
                    var mainPart = wordDoc.AddMainDocumentPart();
                    mainPart.Document = new Document();
                    var body = new Body();

                    // כותרת ראשית
                    var title = new Paragraph(
                        new Run(
                            new RunProperties(
                                new Bold(),
                                new FontSize { Val = "36" },
                                new Color { Val = "2E74B5" }
                            ),
                            new Text("מבחן אוטומטי")
                        )
                    )
                    {
                        ParagraphProperties = new ParagraphProperties(
                            new Justification { Val = JustificationValues.Center },
                            new SpacingBetweenLines { After = "400" }
                        )
                    };
                    body.Append(title);

                    // שדות: שם, תאריך, ציון עם קווים
                    string underline = "____________________";

                    var studentNameLine = new Paragraph(
                        new Run(new Text($"{underline}שם התלמיד"))
                    )
                    {
                        ParagraphProperties = new ParagraphProperties(
                            new SpacingBetweenLines { After = "200" }
                        )
                    };

                    var dateLine = new Paragraph(
                        new Run(new Text($"{underline}תאריך"))
                    )
                    {
                        ParagraphProperties = new ParagraphProperties(
                            new SpacingBetweenLines { After = "200" }
                        )
                    };

                    var gradeLine = new Paragraph(
                        new Run(new Text($"{underline}ציון"))
                    )
                    {
                        ParagraphProperties = new ParagraphProperties(
                            new SpacingBetweenLines { After = "300" }
                        )
                    };

                    body.Append(studentNameLine);
                    body.Append(dateLine);
                    body.Append(gradeLine);

                    // קו מפריד
                    body.Append(new Paragraph(new Run(new Text("────────────────────────────────────────────────────────────")))
                    {
                        ParagraphProperties = new ParagraphProperties(
                            new Justification { Val = JustificationValues.Center },
                            new SpacingBetweenLines { After = "300" }
                        )
                    });

                    // שאלות ותשובות
                    var lines = content
                        .Split('\n')
                        .Select(l => l.Trim())
                        .Where(l =>
                            !string.IsNullOrWhiteSpace(l) &&
                            !l.StartsWith("נראה כי") &&
                            !l.Contains("דוגמה") &&
                            !l.StartsWith("###") &&
                            !l.Contains("שם תלמיד") &&
                            !l.Contains("תאריך") &&
                            !l.StartsWith("###") &&
                            !l.Contains("ציון")
                        ).ToList();

                    foreach (var line in lines)
                    {
                        Paragraph para;

                        if (line.StartsWith("1.") || line.StartsWith("2.") || line.StartsWith("3.") || line.Contains("?"))
                        {
                            para = new Paragraph(
                                new Run(
                                    new RunProperties(
                                        new Bold(),
                                        new FontSize { Val = "26" }
                                    ),
                                    new Text(line)
                                )
                            );
                        }
                        else if (line.StartsWith("- א") || line.StartsWith("- ב") || line.StartsWith("- ג") || line.StartsWith("- ד"))
                        {
                            string checkbox = "☐ ";
                            para = new Paragraph(
                                new Run(
                                    new RunProperties(new FontSize { Val = "24" }),
                                    new Text("    " + checkbox + line.Substring(2).Trim())
                                )
                            );
                        }
                        else
                        {
                            para = new Paragraph(
                                new Run(
                                    new RunProperties(new FontSize { Val = "24" }),
                                    new Text(line)
                                )
                            );
                        }

                        para.ParagraphProperties ??= new ParagraphProperties();
                        para.ParagraphProperties.SpacingBetweenLines = new SpacingBetweenLines { After = "200" };

                        body.Append(para);
                    }

                    mainPart.Document.Append(body);
                    mainPart.Document.Save();
                }

                memoryStream.Position = 0;
                var fileName = $"exam_{Guid.NewGuid()}.docx";
                var s3Url = await _s3Service.UploadFileAsync(memoryStream, fileName, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

                if (s3Url == null)
                    return "❌ שגיאה בשמירה ב-S3.";

                var viewUrl = $"https://view.officeapps.live.com/op/view.aspx?src={Uri.EscapeDataString(s3Url)}";

                var resultObject = new
                {
                    downloadUrl = s3Url,
                    viewUrl = viewUrl
                };

                return JsonSerializer.Serialize(resultObject);
            }
            catch (Exception ex)
            {
                return $"❌ שגיאה ביצירת מבחן: {ex.Message}";
            }
        }
    }
}
