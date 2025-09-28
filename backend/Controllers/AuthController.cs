using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Data;
using HabitTrackerAPI.Models;
using HabitTrackerAPI.DTOs;
using HabitTrackerAPI.Services;
using System.Security.Cryptography;

namespace HabitTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly HabitTrackerContext _context;
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;
        private readonly IGoogleAuthService _googleAuthService;

        public AuthController(
            HabitTrackerContext context, 
            IAuthService authService, 
            IEmailService emailService,
            IGoogleAuthService googleAuthService)
        {
            _context = context;
            _authService = authService;
            _emailService = emailService;
            _googleAuthService = googleAuthService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if user exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email || u.Username == request.Username))
            {
                return Conflict(new { message = "Email or username already in use" });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = _authService.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Level = 1,
                TotalPoints = 0
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _authService.GenerateJwtToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    TotalPoints = user.TotalPoints,
                    Level = user.Level,
                    CurrentStreak = user.CurrentStreak,
                    LongestStreak = user.LongestStreak,
                    CreatedAt = user.CreatedAt,
                    IsGoogleAccount = user.IsGoogleAccount
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            if (!_authService.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var token = _authService.GenerateJwtToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    TotalPoints = user.TotalPoints,
                    Level = user.Level,
                    CurrentStreak = user.CurrentStreak,
                    LongestStreak = user.LongestStreak,
                    CreatedAt = user.CreatedAt,
                    IsGoogleAccount = user.IsGoogleAccount
                }
            });
        }

        [HttpPost("google-login")]
        public async Task<ActionResult<AuthResponse>> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var payload = await _googleAuthService.VerifyGoogleTokenAsync(request.IdToken);
                if (payload == null)
                {
                    return Unauthorized(new { message = "Invalid Google token" });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
                
                if (user == null)
                {
                    // Create new user from Google account
                    user = new User
                    {
                        Username = payload.Email, // Use email as username initially
                        Email = payload.Email,
                        FirstName = payload.GivenName,
                        LastName = payload.FamilyName,
                        GoogleId = payload.Subject,
                        IsGoogleAccount = true,
                        PasswordHash = string.Empty, // No password for Google accounts
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        Level = 1,
                        TotalPoints = 0
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }
                else if (!user.IsGoogleAccount)
                {
                    // Link existing account to Google
                    user.GoogleId = payload.Subject;
                    user.IsGoogleAccount = true;
                    await _context.SaveChangesAsync();
                }

                var token = _authService.GenerateJwtToken(user);

                return Ok(new AuthResponse
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        TotalPoints = user.TotalPoints,
                        Level = user.Level,
                        CurrentStreak = user.CurrentStreak,
                        LongestStreak = user.LongestStreak,
                        CreatedAt = user.CreatedAt,
                        IsGoogleAccount = user.IsGoogleAccount
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Google login failed", error = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    // Don't reveal if email exists - return success anyway
                    return Ok(new { message = "If the email exists, a reset code has been sent." });
                }

                if (user.IsGoogleAccount)
                {
                    return BadRequest(new { message = "Google accounts cannot reset password. Please use Google login." });
                }

                // Generate 6-digit reset token
                var resetToken = GenerateResetToken();
                user.PasswordResetToken = resetToken;
                user.PasswordResetExpires = DateTime.UtcNow.AddMinutes(30);

                await _context.SaveChangesAsync();
                await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken);

                return Ok(new { message = "If the email exists, a reset code has been sent." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to send reset email", error = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => 
                    u.Email == request.Email && 
                    u.PasswordResetToken == request.ResetToken &&
                    u.PasswordResetExpires > DateTime.UtcNow);

                if (user == null)
                {
                    return BadRequest(new { message = "Invalid or expired reset token" });
                }

                user.PasswordHash = _authService.HashPassword(request.NewPassword);
                user.PasswordResetToken = null;
                user.PasswordResetExpires = null;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Password reset successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to reset password", error = ex.Message });
            }
        }

        private static string GenerateResetToken()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var token = Math.Abs(BitConverter.ToInt32(bytes, 0)) % 1000000;
            return token.ToString("D6"); // 6-digit token with leading zeros
        }
    }
}
