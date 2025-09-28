namespace HabitTrackerAPI.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using HabitTrackerAPI.Data;
    using System.Security.Claims;

    [Route("api/[controller]")]
    [ApiController]
    public class PushController : ControllerBase
    {
        private readonly HabitTrackerContext _context;

        public PushController(HabitTrackerContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterPushToken([FromBody] string token)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            user.ExpoPushToken = token;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
