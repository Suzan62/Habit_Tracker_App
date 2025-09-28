using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Data;
using HabitTrackerAPI.Models;
using HabitTrackerAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace HabitTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HabitsController : ControllerBase
    {
        private readonly HabitTrackerContext _context;

        public HabitsController(HabitTrackerContext context)
        {
            _context = context;
        }

        // GET: api/Habits
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Habit>>> GetHabits()
        {
            return await _context.Habits
                .Include(h => h.User)
                .Include(h => h.HabitLogs)
                .Include(h => h.Reminders)
                .ToListAsync();
        }

        // GET: api/Habits/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Habit>> GetHabit(int id)
        {
            var habit = await _context.Habits
                .Include(h => h.User)
                .Include(h => h.HabitLogs)
                .Include(h => h.Reminders)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (habit == null)
            {
                return NotFound();
            }

            return habit;
        }

        // GET: api/Habits/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Habit>>> GetUserHabits(int userId)
        {
            // Verify the user is authorized to access these habits
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null || currentUserId != userId.ToString())
            {
                return Forbid();
            }

            return await _context.Habits
                .Where(h => h.UserId == userId)
                .Include(h => h.HabitLogs)
                .ToListAsync();
        }

        // POST: api/Habits
        // POST: api/Habits
        [HttpPost]
        public async Task<ActionResult<Habit>> PostHabit(CreateHabitDto createHabitDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            // Manually map the DTO to the Habit model
            var habit = new Habit
            {
                UserId = int.Parse(userId),
                Name = createHabitDto.Name,
                Description = createHabitDto.Description,
                Category = (HabitCategory)Enum.Parse(typeof(HabitCategory), createHabitDto.Category),
                Type = (HabitType)Enum.Parse(typeof(HabitType), createHabitDto.Type),
                TargetCount = createHabitDto.TargetCount,
                Unit = createHabitDto.Unit,
                ReminderTime = TimeOnly.Parse(createHabitDto.ReminderTime),
                DaysOfWeek = createHabitDto.DaysOfWeek,
                PointsReward = createHabitDto.PointsReward,
                IsPublic = createHabitDto.IsPublic,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHabit", new { id = habit.Id }, habit);
        }
        // PUT: api/Habits/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHabit(int id, Habit habit)
        {
            if (id != habit.Id)
            {
                return BadRequest();
            }

            var existingHabit = await _context.Habits.FindAsync(id);
            if (existingHabit == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || existingHabit.UserId.ToString() != userId)
            {
                return Forbid();
            }

            existingHabit.Name = habit.Name;
            existingHabit.Description = habit.Description;
            existingHabit.Type = habit.Type;
            existingHabit.Category = habit.Category;
            existingHabit.TargetCount = habit.TargetCount;
            existingHabit.Unit = habit.Unit;
            existingHabit.ReminderTime = habit.ReminderTime;
            existingHabit.DaysOfWeek = habit.DaysOfWeek;
            existingHabit.PointsReward = habit.PointsReward;
            existingHabit.IsActive = habit.IsActive;
            existingHabit.IsPublic = habit.IsPublic;
            existingHabit.UpdatedAt = DateTimeOffset.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HabitExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Habits/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabit(int id)
        {
            var habit = await _context.Habits.FindAsync(id);
            if (habit == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || habit.UserId.ToString() != userId)
            {
                return Forbid();
            }

            // Soft delete
            habit.IsActive = false;
            _context.Entry(habit).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Habits/{id}/log
        [HttpPost("{id}/log")]
        public async Task<ActionResult<HabitLog>> LogHabit(int id, [FromBody] HabitLogDto logDto)
        {
            var habit = await _context.Habits.FindAsync(id);
            if (habit == null)
            {
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || habit.UserId.ToString() != userId)
            {
                return Forbid();
            }

            var logDate = DateOnly.FromDateTime(DateTime.Parse(logDto.LogDate)).ToDateTime(TimeOnly.MinValue);

            var existingLog = await _context.HabitLogs
                .FirstOrDefaultAsync(l => l.HabitId == id && l.UserId == habit.UserId && l.LogDate.Date == logDate.Date);

            if (existingLog != null)
            {
                // Update existing log
                existingLog.Status = logDto.Status;
                existingLog.CompletedCount = logDto.CompletedCount;
                existingLog.Notes = logDto.Notes;
                existingLog.UpdatedAt = DateTimeOffset.UtcNow.UtcDateTime;
                existingLog.PointsEarned = logDto.PointsEarned;
            }
            else
            {
                // Create new log
                var newLog = new HabitLog
                {
                    UserId = habit.UserId,
                    HabitId = id,
                    LogDate = logDate,
                    Status = logDto.Status,
                    CompletedCount = logDto.CompletedCount,
                    TargetCount = logDto.TargetCount,
                    Notes = logDto.Notes,
                    PointsEarned = logDto.PointsEarned,
                    CreatedAt = DateTimeOffset.UtcNow.UtcDateTime,
                    UpdatedAt = DateTimeOffset.UtcNow.UtcDateTime
                };
                _context.HabitLogs.Add(newLog);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET: api/habits/{id}/analytics
        [HttpGet("{id}/analytics")]
        public async Task<ActionResult> GetHabitAnalytics(int id)
        {
            var habit = await _context.Habits.FindAsync(id);
            if (habit == null)
            {
                return NotFound();
            }
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || habit.UserId.ToString() != userId)
            {
                return Forbid();
            }

            var logs = await _context.HabitLogs
                                     .Where(l => l.HabitId == id)
                                     .OrderByDescending(l => l.LogDate)
                                     .ToListAsync();

            var completedLogs = logs.Where(l => l.Status == HabitLogStatus.Completed).ToList();
            var skippedLogs = logs.Where(l => l.Status == HabitLogStatus.Skipped).ToList();

            double totalDays = (DateTime.UtcNow.Date - logs.Min(l => l.LogDate).Date).TotalDays + 1;
            int completedDays = completedLogs.Count;
            int skippedDays = skippedLogs.Count;
            double completionRate = (completedDays / totalDays) * 100;
            int currentStreak = CalculateCurrentStreak(logs);

            // Update streak on the habit model
            if (currentStreak > habit.BestStreak)
            {
                habit.BestStreak = currentStreak;
                _context.Entry(habit).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            // Add a check to reset streak if log date is not consecutive
            if (currentStreak == 0 && habit.CurrentStreak > 0)
            {
                habit.CurrentStreak = 0;
                _context.Entry(habit).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            habit.CurrentStreak = currentStreak;
            _context.Entry(habit).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                TotalDays = totalDays,
                CompletedDays = completedDays,
                SkippedDays = skippedDays,
                CompletionRate = Math.Round(completionRate, 2),
                CurrentStreak = currentStreak,
                TotalPoints = logs.Where(l => l.Status == HabitLogStatus.Completed).Sum(l => l.PointsEarned),
                Logs = logs
            });
        }

        private int CalculateCurrentStreak(List<HabitLog> logs)
        {
            if (!logs.Any()) return 0;

            var sortedLogs = logs.Where(l => l.Status == HabitLogStatus.Completed)
                                 .OrderByDescending(l => l.LogDate)
                                 .ToList();

            if (!sortedLogs.Any()) return 0;

            var streak = 0;
            var currentDate = DateTime.UtcNow.Date;

            foreach (var log in sortedLogs)
            {
                if (log.LogDate.Date == currentDate || log.LogDate.Date == currentDate.AddDays(-1))
                {
                    streak++;
                    currentDate = currentDate.AddDays(-1);
                }
                else if (log.LogDate.Date < currentDate.AddDays(-1))
                {
                    break;
                }
            }

            return streak;
        }

        private bool HabitExists(int id)
        {
            return _context.Habits.Any(e => e.Id == id);
        }
    }
}