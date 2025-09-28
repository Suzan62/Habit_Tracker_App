using System.ComponentModel.DataAnnotations;

namespace HabitTrackerAPI.Models
{
    public enum ReminderType
    {
        Daily,
        Weekly,
        Monthly,
        Custom
    }

    public class HabitReminder
    {
        public int Id { get; set; }
        
        [Required]
        public int HabitId { get; set; }
        
        [Required]
        public TimeOnly ReminderTime { get; set; }
        
        public ReminderType Type { get; set; } = ReminderType.Daily;
        
        // For custom reminders - JSON array of specific dates/days
        public string? CustomSchedule { get; set; }
        
        [StringLength(200)]
        public string? Message { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // For tracking last sent notification
        public DateTime? LastSent { get; set; }
        public DateTime? NextScheduled { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Habit Habit { get; set; } = null!;
    }
}
