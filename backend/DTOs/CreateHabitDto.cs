using System.ComponentModel.DataAnnotations;
using HabitTrackerAPI.Models;

namespace HabitTrackerAPI.DTOs
{
    public class CreateHabitDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public string Category { get; set; } = "Personal";

        public string Type { get; set; } = "Daily";

        public int TargetCount { get; set; } = 1;

        [StringLength(50)]
        public string? Unit { get; set; }

        public string? ReminderTime { get; set; }

        public string? DaysOfWeek { get; set; }

        public int PointsReward { get; set; } = 10;

        public bool IsPublic { get; set; } = false;
    }
}