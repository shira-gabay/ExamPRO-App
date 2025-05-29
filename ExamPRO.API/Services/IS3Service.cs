public interface IS3Service
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType = "application/pdf");
}
