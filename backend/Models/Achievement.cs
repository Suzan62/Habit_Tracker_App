using System.ComponentModel.DataAnnotations;

namespace HabitTrackerAPI.Models
{
    public enum AchievementType
    {
        Streak,
        Completion,
        Point,
        Social,
        Time,
        Category
    }

    public class Achievement
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public AchievementType Type { get; set; } = AchievementType.Completion;
        
        // Achievement criteria
        public int RequiredValue { get; set; } = 1; // e.g., 7 for 7-day streak
        public string? Category { get; set; } // For category-specific achievements
        
        // Rewards
        public int PointsReward { get; set; } = 50;
        
        [StringLength(100)]
        public string? BadgeIcon { get; set; } // Icon name or URL
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
    }

    public class UserAchievement
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int AchievementId { get; set; }
        
        public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Achievement Achievement { get; set; } = null!;
    }
}
