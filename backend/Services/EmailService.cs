using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Options;

namespace HabitTrackerAPI.Services
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = string.Empty;
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; } = string.Empty;
        public string SmtpPassword { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;
    }

    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
        Task SendPasswordResetEmailAsync(string toEmail, string resetToken);
    }

    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = body
                };
                message.Body = builder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
                throw;
            }
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken)
        {
            var subject = "Password Reset Request - HabitTracker";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <div style='background-color: #3498db; color: white; padding: 20px; text-align: center;'>
                        <h1>🎯 HabitTracker</h1>
                        <h2>Password Reset Request</h2>
                    </div>
                    <div style='padding: 30px; background-color: #f8f9fa;'>
                        <p>Hello,</p>
                        <p>You have requested to reset your password for your HabitTracker account.</p>
                        <p>Your password reset code is:</p>
                        <div style='background-color: #fff; border: 2px dashed #3498db; padding: 20px; text-align: center; margin: 20px 0;'>
                            <h1 style='color: #3498db; font-size: 32px; letter-spacing: 5px; margin: 0;'>{resetToken}</h1>
                        </div>
                        <p>Please enter this code in the app to reset your password. This code will expire in 30 minutes.</p>
                        <p style='color: #e74c3c;'><strong>If you did not request this password reset, please ignore this email.</strong></p>
                        <hr style='margin: 30px 0; border: 1px solid #ecf0f1;'>
                        <p style='color: #7f8c8d; font-size: 12px;'>
                            This email was sent by HabitTracker. If you have any questions, please contact our support team.
                        </p>
                    </div>
                </body>
                </html>";

            await SendEmailAsync(toEmail, subject, body);
        }
    }
}
