using HabitTrackerAPI.Data;
using HabitTrackerAPI.DTOs;
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
    public class AchievementsController : ControllerBase
    {
        private readonly HabitTrackerContext _context;

        public AchievementsController(HabitTrackerContext context)
        {
            _context = context;
        }

        // GET: api/achievements
        [HttpGet]
        public async Task<IActionResult> GetAchievements()
        {
            var achievements = await _context.Achievements
                .Where(a => a.IsActive)
                .Select(a => new AchievementDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description,
                    Type = a.Type.ToString(),
                    RequiredValue = a.RequiredValue,
                    PointsReward = a.PointsReward,
                    BadgeIcon = a.BadgeIcon
                })
                .ToListAsync();

            return Ok(achievements);
        }

        // GET: api/achievements/my-achievements
        [HttpGet("my-achievements")]
        public async Task<IActionResult> GetUserAchievements()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized();
            }
            var userId = int.Parse(userIdString);

            var userAchievements = await _context.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Include(ua => ua.Achievement)
                .Select(ua => new UserAchievementDto
                {
                    AchievementId = ua.AchievementId,
                    EarnedAt = ua.EarnedAt,
                    Achievement = new AchievementDto
                    {
                        Id = ua.Achievement.Id,
                        Name = ua.Achievement.Name,
                        Description = ua.Achievement.Description,
                        Type = ua.Achievement.Type.ToString(),
                        RequiredValue = ua.Achievement.RequiredValue,
                        PointsReward = ua.Achievement.PointsReward,
                        BadgeIcon = ua.Achievement.BadgeIcon
                    }
                })
                .ToListAsync();

            return Ok(userAchievements);
        }
    }
}

