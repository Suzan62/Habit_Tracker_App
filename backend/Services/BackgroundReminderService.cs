using HabitTrackerAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text;

namespace HabitTrackerAPI.Services
{
    public class BackgroundReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<BackgroundReminderService> _logger;

        public BackgroundReminderService(IServiceScopeFactory scopeFactory, IConfiguration configuration, ILogger<BackgroundReminderService> logger)
        {
            _scopeFactory = scopeFactory;
            _configuration = configuration;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Background Reminder Service running.");

            while (!stoppingToken.IsCancellationRequested)
            {
                await SendDueRemindersAsync();
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Check every minute
            }

            _logger.LogInformation("Background Reminder Service stopped.");
        }

        private async Task SendDueRemindersAsync()
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<HabitTrackerContext>();

            try
            {
                var now = DateTimeOffset.UtcNow;
                var currentMinuteTime = new TimeOnly(now.Hour, now.Minute);

                var habitsWithReminders = await context.Habits
                    .Where(h => h.IsActive && h.ReminderTime == currentMinuteTime)
                    .Include(h => h.User)
                    .ToListAsync();

                foreach (var habit in habitsWithReminders)
                {
                    _logger.LogInformation($"Sending reminder for habit '{habit.Name}' to user '{habit.User.Username}'.");

                    // You would replace this with an actual push notification service
                    await SendPushNotificationAsync(habit.User.ExpoPushToken, $"Time to complete your habit: {habit.Name}");

                    // Log that a reminder was sent for this time
                    // You might want to update the HabitReminder table here
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while sending reminders.");
            }
        }

        private async Task SendPushNotificationAsync(string? expoPushToken, string message)
        {
            if (string.IsNullOrEmpty(expoPushToken)) return;

            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, "https://exp.host/--/api/v2/push/send");
            var jsonPayload = new
            {
                to = expoPushToken,
                sound = "default",
                title = "Habit Reminder",
                body = message
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(jsonPayload), Encoding.UTF8, "application/json");
            request.Content = jsonContent;

            try
            {
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send push notification to {expoPushToken}.");
            }
        }
    }
}