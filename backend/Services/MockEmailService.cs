using Microsoft.Extensions.Options;

namespace HabitTrackerAPI.Services
{
    public class MockEmailService : IEmailService
    {
        private readonly ILogger<MockEmailService> _logger;

        public MockEmailService(ILogger<MockEmailService> logger)
        {
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // Mock implementation - just log the email
            _logger.LogInformation($"MOCK EMAIL SENT:\nTo: {toEmail}\nSubject: {subject}\nBody: {body}");
            await Task.Delay(100); // Simulate async operation
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken)
        {
            _logger.LogInformation($"MOCK PASSWORD RESET EMAIL:\nTo: {toEmail}\nReset Token: {resetToken}");
            await Task.Delay(100); // Simulate async operation
        }
    }
}
