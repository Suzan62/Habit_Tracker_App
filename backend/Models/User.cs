using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HabitTrackerAPI.Models
{
    public enum UserRole
    {
        User = 0,
        Admin = 1
    }

    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(100)]
        public string? FirstName { get; set; }

        [StringLength(100)]
        public string? LastName { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public UserRole Role { get; set; } = UserRole.User;

        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetExpires { get; set; }

        public string? GoogleId { get; set; }
        public bool IsGoogleAccount { get; set; } = false;

        // This is the new property you need to add
        public string? ExpoPushToken { get; set; }

        public int TotalPoints { get; set; } = 0;
        public int Level { get; set; } = 1;
        public int CurrentStreak { get; set; } = 0;
        public int LongestStreak { get; set; } = 0;

        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<Habit> Habits { get; set; } = new List<Habit>();
        // Ensure other navigation properties are also ignored if they cause a cycle
        [JsonIgnore]
        public virtual ICollection<HabitLog> HabitLogs { get; set; } = new List<HabitLog>();
        [JsonIgnore]
        public virtual ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
        [JsonIgnore]
        public virtual ICollection<Friendship> SentFriendRequests { get; set; } = new List<Friendship>();
        [JsonIgnore]
        public virtual ICollection<Friendship> ReceivedFriendRequests { get; set; } = new List<Friendship>();
    }
}