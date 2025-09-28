namespace HabitTrackerAPI.DTOs
{
    public class AchievementDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Type { get; set; } = string.Empty;
        public int RequiredValue { get; set; }
        public int PointsReward { get; set; }
        public string? BadgeIcon { get; set; }
    }

    public class UserAchievementDto
    {
        public int AchievementId { get; set; }
        public AchievementDto? Achievement { get; set; }
        public DateTime EarnedAt { get; set; }
    }
}

