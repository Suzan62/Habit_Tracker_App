namespace HabitTrackerAPI.DTOs
{
    public class FriendRequestDto
    {
        public int AddresseeId { get; set; }
    }

    public class UpdateFriendshipDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class FriendshipDto
    {
        public int Id { get; set; }
        public int RequesterId { get; set; }
        public UserDto? Requester { get; set; }
        public int AddresseeId { get; set; }
        public UserDto? Addressee { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
    }
}

