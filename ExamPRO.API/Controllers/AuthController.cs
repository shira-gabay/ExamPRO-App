// using Microsoft.AspNetCore.Mvc;

// [Route("api/[controller]")]
// [ApiController]
// public class AuthController : ControllerBase
// {
//     [HttpPost("login")]
//     public IActionResult Login([FromBody] LoginRequest request)
//     {
//         if (request.Username == "admin" && request.Password == "1234") // בדיקה לדוגמה
//         {
//             return Ok(new { message = "Login successful", token = "fake-jwt-token" });
//         }
//         return Unauthorized(new { message = "Invalid credentials" });
//     }
// }

// public class LoginRequest
// {
//     public string Username { get; set; }
//     public string Password { get; set; }
// }
