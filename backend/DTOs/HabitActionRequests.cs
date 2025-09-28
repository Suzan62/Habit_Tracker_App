using System.ComponentModel.DataAnnotations;

namespace HabitTrackerAPI.DTOs
{
    public class HabitCompletionRequest
    {
        public int? CompletedCount { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
    }
    
    public class HabitSkipRequest
    {
        [StringLength(500)]
        public string? Reason { get; set; }
    }
    
    public class CreateHabitRequest
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        [Required]
        public string Category { get; set; } = "Personal";
        
        [Required]
        public string Type { get; set; } = "Daily";
        
        public int TargetCount { get; set; } = 1;
        public string? Unit { get; set; }
        
        public string? ReminderTime { get; set; }
        public string? DaysOfWeek { get; set; }
        
        public int PointsReward { get; set; } = 10;
        public bool IsPublic { get; set; } = false;
    }
}
