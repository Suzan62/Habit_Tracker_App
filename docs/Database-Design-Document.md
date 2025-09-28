# 📊 Habit Tracker System - Database Design Document

## Table of Contents
1. [Entity Sets with Attributes](#entity-sets-with-attributes)
2. [Relationship Matrix](#relationship-matrix)
3. [Entity Relationship Sets](#entity-relationship-sets)
4. [Mapping Cardinalities](#mapping-cardinalities)
5. [ER Diagram](#er-diagram)
6. [Database Schema](#database-schema)

---

## 1. Entity Sets with Attributes

### 1.1 User Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | Primary Key, Auto-increment | Unique user identifier |
| Username | varchar(50) | Not Null, Unique | User's chosen username |
| Email | varchar(255) | Not Null, Unique | User's email address |
| PasswordHash | varchar(255) | Not Null | Hashed password using BCrypt |
| FirstName | varchar(100) | Nullable | User's first name |
| LastName | varchar(100) | Nullable | User's last name |
| CreatedAt | datetime | Not Null, Default: NOW() | Account creation timestamp |
| UpdatedAt | datetime | Not Null, Default: NOW() | Last update timestamp |
| TotalPoints | int | Not Null, Default: 0 | Total gamification points |
| Level | int | Not Null, Default: 1 | User's current level |
| CurrentStreak | int | Not Null, Default: 0 | Current consecutive days streak |
| LongestStreak | int | Not Null, Default: 0 | Longest streak ever achieved |

### 1.2 Habit Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | Primary Key, Auto-increment | Unique habit identifier |
| Name | varchar(200) | Not Null | Habit name/title |
| Description | varchar(1000) | Nullable | Detailed habit description |
| **UserId** | int | Foreign Key, Not Null | Reference to User.Id |
| Type | enum | Not Null, Default: 'Daily' | Habit frequency (Daily/Weekly/Monthly/Custom) |
| Category | enum | Not Null, Default: 'Personal' | Habit category |
| TargetCount | int | Not Null, Default: 1 | Target completion count per period |
| Unit | varchar(50) | Nullable | Unit of measurement (minutes, pages, etc.) |
| ReminderTime | time | Nullable | Preferred reminder time |
| DaysOfWeek | varchar(50) | Nullable | JSON array of days for weekly habits |
| PointsReward | int | Not Null, Default: 10 | Points awarded per completion |
| IsActive | boolean | Not Null, Default: true | Whether habit is active |
| IsPublic | boolean | Not Null, Default: false | Whether habit is visible to friends |
| CreatedAt | datetime | Not Null, Default: NOW() | Habit creation timestamp |
| UpdatedAt | datetime | Not Null, Default: NOW() | Last update timestamp |
| CurrentStreak | int | Not Null, Default: 0 | Current streak for this habit |
| BestStreak | int | Not Null, Default: 0 | Best streak ever for this habit |
| CompletionCount | int | Not Null, Default: 0 | Total completions count |

### 1.3 HabitLog Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | Primary Key, Auto-increment | Unique log identifier |
| **UserId** | int | Foreign Key, Not Null | Reference to User.Id |
| **HabitId** | int | Foreign Key, Not Null | Reference to Habit.Id |
| LogDate | date | Not Null, Default: TODAY | Date of the log entry |
| Status | enum | Not Null, Default: 'Completed' | Completion status |
| CompletedCount | int | Not Null, Default: 1 | Actual completion count |
| TargetCount | int | Not Null, Default: 1 | Target count for that day |
| Notes | varchar(500) | Nullable | User notes for the log |
| PointsEarned | int | Not Null, Default: 0 | Points earned for this completion |
| CreatedAt | datetime | Not Null, Default: NOW() | Log creation timestamp |
| UpdatedAt | datetime | Not Null, Default: NOW() | Last update timestamp |

### 1.4 HabitReminder Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | Primary Key, Auto-increment | Unique reminder identifier |
| **HabitId** | int | Foreign Key, Not Null | Reference to Habit.Id |
| ReminderTime | time | Not Null | Time to send reminder |
| Type | enum | Not Null, Default: 'Daily' | Reminder frequency type |
| CustomSchedule | varchar(500) | Nullable | JSON for custom schedules |
| Message | varchar(200) | Nullable | Custom reminder message |
| IsActive | boolean | Not Null, Default: true | Whether reminder is active |
| LastSent | datetime | Nullable | When reminder was last sent |
| NextScheduled | datetime | Nullable | When next reminder is scheduled |
| CreatedAt | datetime | Not Null, Default: NOW() | Reminder creation timestamp |
| UpdatedAt | datetime | Not Null, Default: NOW() | Last update timestamp |

### 1.5 Achievement Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | Primary Key, Auto-increment | Unique achievement identifier |
| Name | varchar(200) | Not Null | Achievement name |
| Description | varchar(1000) | Nullable | Achievement description |
| Type | enum | Not Null, Default: 'Completion' | Achievement type |
| RequiredValue | int | Not Null, Default: 1 | Value needed to unlock |
| Category | varchar(50) | Nullable | Category for category-specific achievements |
| PointsReward | int | Not Null, Default: 50 | Points awarded for achievement |
| BadgeIcon | varchar(100) | Nullable | Icon name or URL for badge |
| IsActive | boolean | Not Null, Default: true | Whether achievement is active |
| CreatedAt | datetime | Not Null, Default: NOW() | Achievement creation timestamp |

### 1.6 UserAchievement Entity (Junction Table)
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | Primary Key, Auto-increment | Unique user achievement identifier |
| **UserId** | int | Foreign Key, Not Null | Reference to User.Id |
| **AchievementId** | int | Foreign Key, Not Null | Reference to Achievement.Id |
| EarnedAt | datetime | Not Null, Default: NOW() | When achievement was earned |

### 1.7 Friendship Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | Primary Key, Auto-increment | Unique friendship identifier |
| **RequesterId** | int | Foreign Key, Not Null | Reference to User.Id (sender) |
| **AddresseeId** | int | Foreign Key, Not Null | Reference to User.Id (receiver) |
| Status | enum | Not Null, Default: 'Pending' | Friendship status |
| RequestedAt | datetime | Not Null, Default: NOW() | Friend request timestamp |
| RespondedAt | datetime | Nullable | Response timestamp |

---

## 2. Relationship Matrix

| Entity A | Entity B | Relationship Exists | Relationship Type |
|----------|----------|--------------------|--------------------|
| User | Habit | ✅ True | One-to-Many |
| User | HabitLog | ✅ True | One-to-Many |
| User | UserAchievement | ✅ True | One-to-Many |
| User | Friendship (Requester) | ✅ True | One-to-Many |
| User | Friendship (Addressee) | ✅ True | One-to-Many |
| Habit | HabitLog | ✅ True | One-to-Many |
| Habit | HabitReminder | ✅ True | One-to-Many |
| Achievement | UserAchievement | ✅ True | One-to-Many |
| User | Achievement | ❌ False | Direct relationship doesn't exist |
| Habit | User | ❌ False | Reverse of existing relationship |
| HabitLog | HabitReminder | ❌ False | No direct relationship |
| Achievement | Habit | ❌ False | No direct relationship |
| Friendship | Habit | ❌ False | No direct relationship |
| HabitReminder | User | ❌ False | Indirect through Habit |

---

## 3. Entity Relationship Sets

### 3.1 User-Habit Relationship
- **Name**: OWNS
- **Type**: One-to-Many (1:N)
- **Description**: A user owns multiple habits, but each habit belongs to exactly one user
- **Attributes**: None (relationship implemented via foreign key)

### 3.2 User-HabitLog Relationship
- **Name**: LOGS
- **Type**: One-to-Many (1:N)
- **Description**: A user creates multiple habit logs, but each log belongs to exactly one user
- **Attributes**: None (relationship implemented via foreign key)

### 3.3 Habit-HabitLog Relationship
- **Name**: HAS_LOG
- **Type**: One-to-Many (1:N)
- **Description**: A habit has multiple log entries, but each log belongs to exactly one habit
- **Attributes**: None (relationship implemented via foreign key)

### 3.4 Habit-HabitReminder Relationship
- **Name**: HAS_REMINDER
- **Type**: One-to-Many (1:N)
- **Description**: A habit can have multiple reminders, but each reminder belongs to exactly one habit
- **Attributes**: None (relationship implemented via foreign key)

### 3.5 User-Achievement Relationship (via UserAchievement)
- **Name**: EARNS
- **Type**: Many-to-Many (M:N)
- **Description**: A user can earn multiple achievements, and an achievement can be earned by multiple users
- **Junction Table**: UserAchievement
- **Attributes**: EarnedAt (timestamp when achievement was earned)

### 3.6 User-User Relationship (via Friendship)
- **Name**: BEFRIENDS
- **Type**: Many-to-Many (M:N)
- **Description**: Users can be friends with multiple other users
- **Junction Table**: Friendship
- **Attributes**: Status, RequestedAt, RespondedAt

---

## 4. Mapping Cardinalities

| Relationship | Entity A | Cardinality | Entity B | Description |
|-------------|----------|-------------|----------|-------------|
| OWNS | User | 1 | Habit | N | One user owns many habits |
| LOGS | User | 1 | HabitLog | N | One user creates many logs |
| HAS_LOG | Habit | 1 | HabitLog | N | One habit has many log entries |
| HAS_REMINDER | Habit | 1 | HabitReminder | N | One habit has many reminders |
| EARNS | User | M | Achievement | N | Many users earn many achievements |
| BEFRIENDS | User | M | User | N | Many users befriend many users |

### Cardinality Constraints Detail:

1. **User:Habit (1:N)**
   - Minimum: 1 user must have 0 or more habits
   - Maximum: 1 user can have unlimited habits
   - Each habit belongs to exactly 1 user

2. **User:HabitLog (1:N)**
   - Minimum: 1 user must have 0 or more habit logs
   - Maximum: 1 user can have unlimited habit logs
   - Each habit log belongs to exactly 1 user

3. **Habit:HabitLog (1:N)**
   - Minimum: 1 habit must have 0 or more log entries
   - Maximum: 1 habit can have unlimited log entries
   - Each log entry belongs to exactly 1 habit

4. **User:Achievement (M:N via UserAchievement)**
   - Minimum: 1 user can have 0 or more achievements
   - Maximum: 1 user can earn all available achievements
   - 1 achievement can be earned by 0 or more users

---

## 5. ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HABIT TRACKER ER DIAGRAM                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│      USER        │         │      HABIT       │         │    HABITLOG      │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ • Id (PK)        │    1    │ • Id (PK)        │    1    │ • Id (PK)        │
│ • Username       │ ────────│ • UserId (FK)    │ ────────│ • UserId (FK)    │
│ • Email          │  OWNS   │ • Name           │HAS_LOG  │ • HabitId (FK)   │
│ • PasswordHash   │         │ • Description    │         │ • LogDate        │
│ • FirstName      │       N │ • Type           │       N │ • Status         │
│ • LastName       │         │ • Category       │         │ • CompletedCount │
│ • CreatedAt      │         │ • TargetCount    │         │ • TargetCount    │
│ • UpdatedAt      │         │ • Unit           │         │ • Notes          │
│ • TotalPoints    │         │ • ReminderTime   │         │ • PointsEarned   │
│ • Level          │         │ • DaysOfWeek     │         │ • CreatedAt      │
│ • CurrentStreak  │         │ • PointsReward   │         │ • UpdatedAt      │
│ • LongestStreak  │         │ • IsActive       │         └──────────────────┘
└──────────────────┘         │ • IsPublic       │
          │                  │ • CreatedAt      │
          │                  │ • UpdatedAt      │         ┌──────────────────┐
          │                  │ • CurrentStreak  │         │  HABITREMINDER   │
          │                  │ • BestStreak     │         ├──────────────────┤
          │                  │ • CompletionCount│    1    │ • Id (PK)        │
          │                  └──────────────────┘ ────────│ • HabitId (FK)   │
          │                           │          HAS_REM  │ • ReminderTime   │
          │                           │                 N │ • Type           │
          │                           │                   │ • CustomSchedule │
          │                           │                   │ • Message        │
          │ M                         │                   │ • IsActive       │
          │                           │                   │ • LastSent       │
┌─────────┴──────────┐               │                   │ • NextScheduled  │
│   USERACHIEVEMENT  │               │                   │ • CreatedAt      │
├────────────────────┤               │                   │ • UpdatedAt      │
│ • Id (PK)          │               │                   └──────────────────┘
│ • UserId (FK)      │               │
│ • AchievementId(FK)│               │
│ • EarnedAt         │               │
└─────────┬──────────┘               │
          │ N                        │
          │                          │
          │ M                        │
┌─────────┴──────────┐               │
│    ACHIEVEMENT     │               │
├────────────────────┤               │
│ • Id (PK)          │               │
│ • Name             │               │
│ • Description      │               │
│ • Type             │               │
│ • RequiredValue    │               │
│ • Category         │               │
│ • PointsReward     │               │
│ • BadgeIcon        │               │
│ • IsActive         │               │
│ • CreatedAt        │               │
└────────────────────┘               │
                                     │
┌────────────────────┐               │
│    FRIENDSHIP      │               │
├────────────────────┤               │
│ • Id (PK)          │      M        │
│ • RequesterId (FK) │ ──────────────┘
│ • AddresseeId (FK) │   BEFRIENDS
│ • Status           │
│ • RequestedAt      │      M
│ • RespondedAt      │ ──────────────┐
└────────────────────┘               │
                                     │
                                     ▼
                            (Self-referencing to USER)
```

---

## 6. Database Schema

### 6.1 Primary Keys and Foreign Keys

#### Primary Keys:
- `Users.Id`
- `Habits.Id`
- `HabitLogs.Id`
- `HabitReminders.Id`
- `Achievements.Id`
- `UserAchievements.Id`
- `Friendships.Id`

#### Foreign Key Relationships:
```sql
-- Habit references User
ALTER TABLE Habits ADD CONSTRAINT FK_Habits_Users 
FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE;

-- HabitLog references User and Habit
ALTER TABLE HabitLogs ADD CONSTRAINT FK_HabitLogs_Users
FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE RESTRICT;

ALTER TABLE HabitLogs ADD CONSTRAINT FK_HabitLogs_Habits
FOREIGN KEY (HabitId) REFERENCES Habits(Id) ON DELETE CASCADE;

-- HabitReminder references Habit
ALTER TABLE HabitReminders ADD CONSTRAINT FK_HabitReminders_Habits
FOREIGN KEY (HabitId) REFERENCES Habits(Id) ON DELETE CASCADE;

-- UserAchievement references User and Achievement
ALTER TABLE UserAchievements ADD CONSTRAINT FK_UserAchievements_Users
FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE;

ALTER TABLE UserAchievements ADD CONSTRAINT FK_UserAchievements_Achievements
FOREIGN KEY (AchievementId) REFERENCES Achievements(Id) ON DELETE CASCADE;

-- Friendship self-references User
ALTER TABLE Friendships ADD CONSTRAINT FK_Friendships_RequesterUsers
FOREIGN KEY (RequesterId) REFERENCES Users(Id) ON DELETE RESTRICT;

ALTER TABLE Friendships ADD CONSTRAINT FK_Friendships_AddresseeUsers
FOREIGN KEY (AddresseeId) REFERENCES Users(Id) ON DELETE RESTRICT;
```

### 6.2 Unique Constraints

```sql
-- User constraints
ALTER TABLE Users ADD CONSTRAINT UQ_Users_Email UNIQUE (Email);
ALTER TABLE Users ADD CONSTRAINT UQ_Users_Username UNIQUE (Username);

-- HabitLog constraint (one log per habit per day per user)
ALTER TABLE HabitLogs ADD CONSTRAINT UQ_HabitLogs_UserHabitDate 
UNIQUE (UserId, HabitId, LogDate);

-- UserAchievement constraint (one achievement per user)
ALTER TABLE UserAchievements ADD CONSTRAINT UQ_UserAchievements_UserAchievement
UNIQUE (UserId, AchievementId);

-- Friendship constraint (one friendship record per user pair)
ALTER TABLE Friendships ADD CONSTRAINT UQ_Friendships_RequesterAddressee
UNIQUE (RequesterId, AddresseeId);
```

### 6.3 Indexes for Performance

```sql
-- User indexes
CREATE INDEX IDX_Users_Email ON Users(Email);
CREATE INDEX IDX_Users_Username ON Users(Username);

-- Habit indexes
CREATE INDEX IDX_Habits_UserId ON Habits(UserId);
CREATE INDEX IDX_Habits_Category ON Habits(Category);
CREATE INDEX IDX_Habits_IsActive ON Habits(IsActive);

-- HabitLog indexes
CREATE INDEX IDX_HabitLogs_UserId ON HabitLogs(UserId);
CREATE INDEX IDX_HabitLogs_HabitId ON HabitLogs(HabitId);
CREATE INDEX IDX_HabitLogs_LogDate ON HabitLogs(LogDate);
CREATE INDEX IDX_HabitLogs_Status ON HabitLogs(Status);

-- HabitReminder indexes
CREATE INDEX IDX_HabitReminders_HabitId ON HabitReminders(HabitId);
CREATE INDEX IDX_HabitReminders_IsActive ON HabitReminders(IsActive);

-- UserAchievement indexes
CREATE INDEX IDX_UserAchievements_UserId ON UserAchievements(UserId);
CREATE INDEX IDX_UserAchievements_AchievementId ON UserAchievements(AchievementId);

-- Friendship indexes
CREATE INDEX IDX_Friendships_RequesterId ON Friendships(RequesterId);
CREATE INDEX IDX_Friendships_AddresseeId ON Friendships(AddresseeId);
CREATE INDEX IDX_Friendships_Status ON Friendships(Status);
```

---

## 7. Enumeration Values

### 7.1 Habit.Type Enum
- `Daily` - Daily habits
- `Weekly` - Weekly habits  
- `Monthly` - Monthly habits
- `Custom` - Custom frequency

### 7.2 Habit.Category Enum
- `Health` - Health-related habits
- `Fitness` - Exercise and fitness
- `Learning` - Educational activities
- `Work` - Work-related habits
- `Personal` - Personal development
- `Social` - Social activities
- `Creative` - Creative pursuits
- `Financial` - Financial habits
- `Other` - Miscellaneous

### 7.3 HabitLog.Status Enum
- `Completed` - Successfully completed
- `Skipped` - Intentionally skipped
- `Partial` - Partially completed

### 7.4 HabitReminder.Type Enum
- `Daily` - Daily reminders
- `Weekly` - Weekly reminders
- `Monthly` - Monthly reminders
- `Custom` - Custom schedule

### 7.5 Achievement.Type Enum
- `Streak` - Streak-based achievements
- `Completion` - Completion count achievements
- `Point` - Points-based achievements
- `Social` - Social interaction achievements
- `Time` - Time-based achievements
- `Category` - Category-specific achievements

### 7.6 Friendship.Status Enum
- `Pending` - Friend request pending
- `Accepted` - Friendship accepted
- `Declined` - Friend request declined
- `Blocked` - User blocked

---

## 8. Business Rules and Constraints

1. **User Registration**: Email and username must be unique
2. **Habit Ownership**: Each habit belongs to exactly one user
3. **Daily Logging**: Maximum one log entry per habit per day per user
4. **Achievement Earning**: Each achievement can only be earned once per user
5. **Friendship**: Users cannot send friend requests to themselves
6. **Streak Calculation**: Streaks are calculated based on consecutive completion days
7. **Point System**: Points are awarded only for completed habits
8. **Reminder Scheduling**: Reminders can only be set for active habits
9. **Data Integrity**: Soft delete for habits (mark as inactive) to preserve logs
10. **Privacy**: Public habits are visible to friends, private habits are user-only

This comprehensive database design provides a solid foundation for the habit tracking system with proper normalization, relationships, and constraints to ensure data integrity and optimal performance.
