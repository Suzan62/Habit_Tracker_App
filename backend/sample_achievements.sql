-- Sample Achievements for Habit Tracker
-- Run this script to populate your database with sample achievements

INSERT INTO "Achievements" ("Name", "Description", "Type", "RequiredValue", "Category", "PointsReward", "BadgeIcon", "IsActive", "CreatedAt") VALUES

-- Streak Achievements
('First Steps', 'Complete any habit for 1 day', 0, 1, NULL, 10, '🚀', true, NOW()),
('Getting Started', 'Maintain a 3-day streak', 0, 3, NULL, 25, '🌱', true, NOW()),
('Week Warrior', 'Maintain a 7-day streak', 0, 7, NULL, 50, '💪', true, NOW()),
('Consistency King', 'Maintain a 14-day streak', 0, 14, NULL, 100, '👑', true, NOW()),
('Month Master', 'Maintain a 30-day streak', 0, 30, NULL, 200, '🎯', true, NOW()),
('Streak Legend', 'Maintain a 100-day streak', 0, 100, NULL, 500, '🏆', true, NOW()),

-- Completion Achievements
('Habit Creator', 'Create your first habit', 1, 1, NULL, 20, '✨', true, NOW()),
('Productive Day', 'Complete 3 habits in one day', 1, 3, NULL, 30, '🌟', true, NOW()),
('Super Productive', 'Complete 5 habits in one day', 1, 5, NULL, 50, '⭐', true, NOW()),
('Habit Master', 'Complete 10 different habits', 1, 10, NULL, 100, '🎖️', true, NOW()),
('Century Club', 'Complete 100 total habit logs', 1, 100, NULL, 150, '💯', true, NOW()),

-- Point Achievements
('Point Collector', 'Earn 100 points', 2, 100, NULL, 25, '💰', true, NOW()),
('Point Hoarder', 'Earn 500 points', 2, 500, NULL, 75, '💸', true, NOW()),
('Point Millionaire', 'Earn 1000 points', 2, 1000, NULL, 150, '🏦', true, NOW()),

-- Category Specific Achievements
('Health Enthusiast', 'Complete 10 Health habits', 5, 10, 'Health', 50, '🏥', true, NOW()),
('Fitness Fanatic', 'Complete 10 Fitness habits', 5, 10, 'Fitness', 50, '💪', true, NOW()),
('Learning Lover', 'Complete 10 Learning habits', 5, 10, 'Learning', 50, '📚', true, NOW()),
('Work Warrior', 'Complete 10 Work habits', 5, 10, 'Work', 50, '💼', true, NOW()),

-- Time Based Achievements
('Early Bird', 'Complete habits for 7 consecutive mornings', 4, 7, NULL, 75, '🌅', true, NOW()),
('Night Owl', 'Complete habits for 7 consecutive evenings', 4, 7, NULL, 75, '🦉', true, NOW()),

-- Social Achievements
('Social Butterfly', 'Add your first friend', 3, 1, NULL, 30, '🦋', true, NOW()),
('Friend Collector', 'Add 5 friends', 3, 5, NULL, 75, '👥', true, NOW()),
('Popular Person', 'Add 10 friends', 3, 10, NULL, 150, '🎉', true, NOW());
