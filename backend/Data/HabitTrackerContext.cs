using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Models;

namespace HabitTrackerAPI.Data
{
    public class HabitTrackerContext : DbContext
    {
        public HabitTrackerContext(DbContextOptions<HabitTrackerContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitLog> HabitLogs { get; set; }
        public DbSet<HabitReminder> HabitReminders { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<UserAchievement> UserAchievements { get; set; }
        public DbSet<Friendship> Friendships { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");
            });

            // Habit configuration
            modelBuilder.Entity<Habit>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                      .WithMany(e => e.Habits)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");
            });

            // HabitLog configuration
            modelBuilder.Entity<HabitLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                      .WithMany(e => e.HabitLogs)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Habit)
                      .WithMany(e => e.HabitLogs)
                      .HasForeignKey(e => e.HabitId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => new { e.UserId, e.HabitId, e.LogDate }).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");
            });

            // HabitReminder configuration
            modelBuilder.Entity<HabitReminder>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Habit)
                      .WithMany(e => e.Reminders)
                      .HasForeignKey(e => e.HabitId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("NOW()");
            });

            // Achievement configuration
            modelBuilder.Entity<Achievement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            });

            // UserAchievement configuration
            modelBuilder.Entity<UserAchievement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                      .WithMany(e => e.UserAchievements)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Achievement)
                      .WithMany(e => e.UserAchievements)
                      .HasForeignKey(e => e.AchievementId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => new { e.UserId, e.AchievementId }).IsUnique();
                entity.Property(e => e.EarnedAt).HasDefaultValueSql("NOW()");
            });

            // Friendship configuration
            modelBuilder.Entity<Friendship>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Requester)
                      .WithMany(e => e.SentFriendRequests)
                      .HasForeignKey(e => e.RequesterId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Addressee)
                      .WithMany(e => e.ReceivedFriendRequests)
                      .HasForeignKey(e => e.AddresseeId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(e => new { e.RequesterId, e.AddresseeId }).IsUnique();
                entity.Property(e => e.RequestedAt).HasDefaultValueSql("NOW()");
            });
        }
    }
}
