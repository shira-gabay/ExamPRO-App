using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3Service(IConfiguration configuration)
    {
        var accessKey = configuration["AWS:AccessKey"];
        var secretKey = configuration["AWS:SecretKey"];
        var region = configuration["AWS:Region"];
        _bucketName = configuration["AWS:BucketName"];

        if (string.IsNullOrWhiteSpace(accessKey) || string.IsNullOrWhiteSpace(secretKey) ||
            string.IsNullOrWhiteSpace(region) || string.IsNullOrWhiteSpace(_bucketName))
        {
            throw new ArgumentException("Missing AWS credentials or configuration.");
        }

        var awsRegion = RegionEndpoint.GetBySystemName(region);
        _s3Client = new AmazonS3Client(accessKey, secretKey, awsRegion);
    }

    // מעלה קובץ מבחן ומחזיר URL ישיר (פומבי) ל-S3
   public async Task<string> UploadExamFileAsync(string examId, Stream fileStream, string fileName, string contentType = "application/pdf")
{Console.WriteLine("📥 UploadExamFileAsync called");

    try
    {
        var key = $"exams/{examId}/test/{fileName}";
        Console.WriteLine($"📂 Key to upload: {key}");

        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = fileStream,
            Key = key,
            BucketName = _bucketName,
            ContentType = contentType,
            //CannedACL = S3CannedACL.PublicRead
        };

        using var transferUtility = new TransferUtility(_s3Client);
        await transferUtility.UploadAsync(uploadRequest);
        Console.WriteLine("✅ Upload successful.");

        var metadataResponse = await _s3Client.GetObjectMetadataAsync(new GetObjectMetadataRequest
        {
            BucketName = _bucketName,
            Key = key
        });

        if (metadataResponse.HttpStatusCode == HttpStatusCode.OK)
        {
            var url = GenerateDirectS3Url(key);
            Console.WriteLine($"🌍 Generated public URL: {url}");
            return url;
        }

        Console.WriteLine("⚠️ Metadata response not OK.");
        return null;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Upload error: {ex.Message}");
        throw;
    }
}
    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType = "application/octet-stream")
    {
        try
        {
            Console.WriteLine("🚀 Starting upload to S3...");

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = fileStream,
                Key = fileName,
                BucketName = _bucketName,
                ContentType = contentType,
                // CannedACL = S3CannedACL.PublicRead
            };

            using var transferUtility = new TransferUtility(_s3Client);
            await transferUtility.UploadAsync(uploadRequest);

            Console.WriteLine("✅ Upload completed. Verifying existence in bucket...");

            var metadataRequest = new GetObjectMetadataRequest
            {
                BucketName = _bucketName,
                Key = fileName
            };

            var metadataResponse = await _s3Client.GetObjectMetadataAsync(metadataRequest);

            if (metadataResponse.HttpStatusCode == HttpStatusCode.OK)
            {
                Console.WriteLine("🎯 File verified in S3.");
                return GenerateDirectS3Url(fileName); // מחזיר URL ישיר ל-S3
            }
            else
            {
                Console.WriteLine("⚠️ File not found in S3 after upload.");
                return null;
            }
        }
        catch (AmazonS3Exception s3Ex)
        {
            Console.WriteLine($"❌ S3 Exception: {s3Ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ General Exception: {ex.Message}");
            throw;
        }
    }

    // פונקציה שמחזירה URL ישיר ל-S3 עם קידוד תקין של שם הקובץ
private string GenerateDirectS3Url(string key)
{
    var parts = key.Split('/');
    for (int i = 0; i < parts.Length; i++)
    {
        parts[i] = Uri.EscapeDataString(parts[i]);
    }

    var encodedKey = string.Join("/", parts);
    var url = $"https://{_bucketName}.s3.amazonaws.com/{encodedKey}";
    Console.WriteLine($"🔗 Encoded S3 URL: {url}");
    return url;
}


    // פונקציה ליצירת URL חתום עם תוקף (לא חובה אם את רוצה קישור פומבי)
    public string GeneratePreSignedUrl(string key, int expirationInMinutes = 15)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Expires = DateTime.UtcNow.AddMinutes(expirationInMinutes),
            Verb = HttpVerb.GET,
            ResponseHeaderOverrides = new ResponseHeaderOverrides
            {
                ContentDisposition = "inline"
            }
        };

        var url = _s3Client.GetPreSignedURL(request);
        return url;
    }
}
