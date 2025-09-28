using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HabitTrackerAPI.Models
{
    public enum HabitType
    {
        Daily,
        Weekly,
        Monthly,
        Custom
    }

    public enum HabitCategory
    {
        Health,
        Fitness,
        Learning,
        Work,
        Personal,
        Social,
        Creative,
        Financial,
        Other
    }

    public class Habit
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public int UserId { get; set; }

        public HabitType Type { get; set; } = HabitType.Daily;
        public HabitCategory Category { get; set; } = HabitCategory.Personal;

        // Target properties
        public int TargetCount { get; set; } = 1; // How many times per period
        public string? Unit { get; set; } // e.g., "minutes", "pages", "glasses"

        // Scheduling
        public TimeOnly? ReminderTime { get; set; }
        public string? DaysOfWeek { get; set; } // JSON array of days for weekly habits

        // Gamification
        public int PointsReward { get; set; } = 10;

        // Status
        public bool IsActive { get; set; } = true;
        public bool IsPublic { get; set; } = false; // For social features

        // Metadata
        public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTime.UtcNow;

        // Calculated properties (will be computed)
        public int CurrentStreak { get; set; } = 0;
        public int BestStreak { get; set; } = 0;
        public int CompletionCount { get; set; } = 0;

        // Navigation properties
        [JsonIgnore] // Add this attribute to prevent the serialization loop
        public virtual User User { get; set; } = null!;
        public virtual ICollection<HabitLog> HabitLogs { get; set; } = new List<HabitLog>();
        public virtual ICollection<HabitReminder> Reminders { get; set; } = new List<HabitReminder>();
    }
}