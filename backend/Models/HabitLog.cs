using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HabitTrackerAPI.Models
{
    public enum HabitLogStatus
    {
        Completed,
        Skipped,
        Partial
    }

    public class HabitLog
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int HabitId { get; set; }
        
        public DateTime LogDate { get; set; } = DateTime.UtcNow.Date; // Date only
        
        public HabitLogStatus Status { get; set; } = HabitLogStatus.Completed;
        
        // For habits with quantities (e.g., 30 minutes of exercise)
        public int CompletedCount { get; set; } = 1;
        public int TargetCount { get; set; } = 1;
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        // Points earned for this completion
        public int PointsEarned { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public virtual User User { get; set; } = null!;
        public virtual Habit Habit { get; set; } = null!;
    }
}
