using System.ComponentModel.DataAnnotations;

namespace HabitTrackerAPI.Models
{
    public enum FriendshipStatus
    {
        Pending,
        Accepted,
        Declined,
        Blocked
    }

    public class Friendship
    {
        public int Id { get; set; }
        
        [Required]
        public int RequesterId { get; set; } // User who sent the request
        
        [Required]
        public int AddresseeId { get; set; } // User who received the request
        
        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
        
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RespondedAt { get; set; }
        
        // Navigation properties
        public virtual User Requester { get; set; } = null!;
        public virtual User Addressee { get; set; } = null!;
    }
}
