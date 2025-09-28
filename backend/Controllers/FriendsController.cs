using HabitTrackerAPI.Data;
using HabitTrackerAPI.DTOs;
using HabitTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HabitTrackerAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FriendsController : ControllerBase
    {
        private readonly HabitTrackerContext _context;

        public FriendsController(HabitTrackerContext context)
        {
            _context = context;
        }

        // POST: api/friends/send-request
        [HttpPost("send-request")]
        public async Task<IActionResult> SendFriendRequest([FromBody] FriendRequestDto requestDto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized();
            }
            var requesterId = int.Parse(userIdString);

            if (requesterId == requestDto.AddresseeId)
            {
                return BadRequest("You cannot send a friend request to yourself.");
            }

            var existingFriendship = await _context.Friendships
                .FirstOrDefaultAsync(f => (f.RequesterId == requesterId && f.AddresseeId == requestDto.AddresseeId) ||
                                          (f.RequesterId == requestDto.AddresseeId && f.AddresseeId == requesterId));

            if (existingFriendship != null)
            {
                return Conflict("A friendship request already exists or has been processed.");
            }

            var friendship = new Friendship
            {
                RequesterId = requesterId,
                AddresseeId = requestDto.AddresseeId,
                Status = FriendshipStatus.Pending
            };

            _context.Friendships.Add(friendship);
            await _context.SaveChangesAsync();

            return Ok("Friend request sent.");
        }

        // GET: api/friends/requests
        [HttpGet("requests")]
        public async Task<IActionResult> GetFriendRequests()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdString);

            var requests = await _context.Friendships
                .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
                .Include(f => f.Requester)
                .Select(f => new FriendshipDto
                {
                    Id = f.Id,
                    RequesterId = f.RequesterId,
                    Requester = new UserDto
                    {
                        Id = f.Requester.Id,
                        Username = f.Requester.Username,
                        FirstName = f.Requester.FirstName,
                        LastName = f.Requester.LastName
                    },
                    Status = f.Status.ToString(),
                    RequestedAt = f.RequestedAt
                })
                .ToListAsync();

            return Ok(requests);
        }

        // PUT: api/friends/requests/{id}
        [HttpPut("requests/{id}")]
        public async Task<IActionResult> RespondToFriendRequest(int id, [FromBody] UpdateFriendshipDto updateDto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdString);

            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f => f.Id == id && f.AddresseeId == userId);

            if (friendship == null)
            {
                return NotFound("Friendship request not found.");
            }

            if (friendship.Status != FriendshipStatus.Pending)
            {
                return Conflict("This request has already been responded to.");
            }
            
            if (Enum.TryParse<FriendshipStatus>(updateDto.Status, true, out var newStatus))
            {
                friendship.Status = newStatus;
                friendship.RespondedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok($"Friend request {newStatus.ToString().ToLower()}.");
            }

            return BadRequest("Invalid status provided.");
        }

        // GET: api/friends
        [HttpGet]
        public async Task<IActionResult> GetFriends()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdString);

            var friends = await _context.Friendships
                .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) && f.Status == FriendshipStatus.Accepted)
                .Include(f => f.Requester)
                .Include(f => f.Addressee)
                .Select(f => new FriendshipDto
                {
                    Id = f.Id,
                    RequesterId = f.RequesterId,
                    Requester = new UserDto { Id = f.Requester.Id, Username = f.Requester.Username },
                    AddresseeId = f.AddresseeId,
                    Addressee = new UserDto { Id = f.Addressee.Id, Username = f.Addressee.Username },
                    Status = f.Status.ToString(),
                    RequestedAt = f.RequestedAt
                })
                .ToListAsync();

            return Ok(friends);
        }
    }
}
