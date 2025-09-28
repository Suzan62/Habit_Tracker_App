using HabitTrackerAPI.Models;

namespace HabitTrackerAPI.DTOs
{
    public class HabitLogDto
    {
        public string LogDate { get; set; } = string.Empty;
        public HabitLogStatus Status { get; set; }
        public int CompletedCount { get; set; } = 1;
        public int TargetCount { get; set; } = 1;
        public string? Notes { get; set; }
        public int PointsEarned { get; set; } = 0;
    }
}