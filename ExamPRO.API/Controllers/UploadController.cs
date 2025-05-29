// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Http;
// using System.IO;
// using System.Threading.Tasks;

// [Route("api/upload")]
// [ApiController]
// public class UploadController : ControllerBase
// {
//     private readonly S3Service _s3Service;

//     public UploadController(S3Service s3Service)
//     {
//         _s3Service = s3Service;
//     }

//     [HttpPost]
//     [Consumes("multipart/form-data")]
//     public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
//     {
//         if (file == null || file.Length == 0)
//         {
//             return BadRequest("No file uploaded.");
//         }

//         using (var fileStream = file.OpenReadStream())
//         {
//             var fileUrl = await _s3Service.UploadFileAsync(fileStream, file.FileName);
//             return Ok(new { url = fileUrl });
//         }
//     }
// }
