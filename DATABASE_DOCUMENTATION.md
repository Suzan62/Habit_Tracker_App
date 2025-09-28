# 🗄️ Habit Tracker System - Database Documentation

## Table of Contents
1. [Entity Sets with Attributes](#1-entity-sets-with-attributes)
2. [Entity Relationships Matrix](#2-entity-relationships-matrix)
3. [Entity-Relationship Sets and Mapping Cardinality](#3-entity-relationship-sets-and-mapping-cardinality)
4. [ER Diagram Description](#4-er-diagram-description)
5. [Relational Schema](#5-relational-schema)

---

## 1. Entity Sets with Attributes

### 1.1 User Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | PRIMARY KEY, NOT NULL, IDENTITY | Unique identifier for user |
| Username | string(50) | NOT NULL, UNIQUE | User's display name |
| Email | string | NOT NULL, UNIQUE, EMAIL_FORMAT | User's email address |
| PasswordHash | string | NOT NULL | BCrypt hashed password |
| FirstName | string(100) | NULL | User's first name |
| LastName | string(100) | NULL | User's last name |
| CreatedAt | DateTime | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| UpdatedAt | DateTime | NOT NULL, DEFAULT NOW() | Last update timestamp |
| TotalPoints | int | NOT NULL, DEFAULT 0 | Gamification points earned |
| Level | int | NOT NULL, DEFAULT 1 | User's current level |
| CurrentStreak | int | NOT NULL, DEFAULT 0 | Current active streak |
| LongestStreak | int | NOT NULL, DEFAULT 0 | Best streak achieved |

### 1.2 Habit Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | PRIMARY KEY, NOT NULL, IDENTITY | Unique identifier for habit |
| Name | string(200) | NOT NULL | Habit name/title |
| Description | string(1000) | NULL | Detailed description |
| **UserId** | int | NOT NULL, FOREIGN KEY → User(Id) | Owner of the habit |
| Type | HabitType enum | NOT NULL, DEFAULT Daily | Frequency type |
| Category | HabitCategory enum | NOT NULL, DEFAULT Personal | Habit category |
| TargetCount | int | NOT NULL, DEFAULT 1 | Target completions per period |
| Unit | string | NULL | Measurement unit |
| ReminderTime | TimeOnly | NULL | Scheduled reminder time |
| DaysOfWeek | string | NULL | JSON array of active days |
| PointsReward | int | NOT NULL, DEFAULT 10 | Points earned per completion |
| IsActive | bool | NOT NULL, DEFAULT true | Whether habit is active |
| IsPublic | bool | NOT NULL, DEFAULT false | Visibility to friends |
| CreatedAt | DateTime | NOT NULL, DEFAULT NOW() | Creation timestamp |
| UpdatedAt | DateTime | NOT NULL, DEFAULT NOW() | Last update timestamp |
| CurrentStreak | int | NOT NULL, DEFAULT 0 | Current streak for this habit |
| BestStreak | int | NOT NULL, DEFAULT 0 | Best streak for this habit |
| CompletionCount | int | NOT NULL, DEFAULT 0 | Total completions |

### 1.3 HabitLog Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | PRIMARY KEY, NOT NULL, IDENTITY | Unique identifier for log entry |
| **UserId** | int | NOT NULL, FOREIGN KEY → User(Id) | User who logged |
| **HabitId** | int | NOT NULL, FOREIGN KEY → Habit(Id) | Habit being logged |
| LogDate | DateTime | NOT NULL, DEFAULT TODAY | Date of completion |
| Status | HabitLogStatus enum | NOT NULL, DEFAULT Completed | Completion status |
| CompletedCount | int | NOT NULL, DEFAULT 1 | Actual completion count |
| TargetCount | int | NOT NULL, DEFAULT 1 | Target for that day |
| Notes | string(500) | NULL | Optional notes |
| PointsEarned | int | NOT NULL, DEFAULT 0 | Points earned |
| CreatedAt | DateTime | NOT NULL, DEFAULT NOW() | Log creation timestamp |
| UpdatedAt | DateTime | NOT NULL, DEFAULT NOW() | Last update timestamp |

### 1.4 HabitReminder Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | PRIMARY KEY, NOT NULL, IDENTITY | Unique identifier for reminder |
| **HabitId** | int | NOT NULL, FOREIGN KEY → Habit(Id) | Associated habit |
| ReminderTime | TimeOnly | NOT NULL | Time to send reminder |
| Type | ReminderType enum | NOT NULL, DEFAULT Daily | Reminder frequency |
| CustomSchedule | string | NULL | JSON for custom schedules |
| Message | string(200) | NULL | Custom reminder message |
| IsActive | bool | NOT NULL, DEFAULT true | Whether reminder is active |
| LastSent | DateTime | NULL | Last notification sent |
| NextScheduled | DateTime | NULL | Next scheduled notification |
| CreatedAt | DateTime | NOT NULL, DEFAULT NOW() | Creation timestamp |
| UpdatedAt | DateTime | NOT NULL, DEFAULT NOW() | Last update timestamp |

### 1.5 Achievement Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | PRIMARY KEY, NOT NULL, IDENTITY | Unique identifier for achievement |
| Name | string(200) | NOT NULL | Achievement name |
| Description | string(1000) | NULL | Achievement description |
| Type | AchievementType enum | NOT NULL, DEFAULT Completion | Achievement category |
| RequiredValue | int | NOT NULL, DEFAULT 1 | Threshold to unlock |
| Category | string | NULL | Specific category filter |
| PointsReward | int | NOT NULL, DEFAULT 50 | Points awarded |
| BadgeIcon | string(100) | NULL | Icon identifier |
| IsActive | bool | NOT NULL, DEFAULT true | Whether achievement is available |
| CreatedAt | DateTime | NOT NULL, DEFAULT NOW() | Creation timestamp |

### 1.6 UserAchievement Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | PRIMARY KEY, NOT NULL, IDENTITY | Unique identifier |
| **UserId** | int | NOT NULL, FOREIGN KEY → User(Id) | User who earned it |
| **AchievementId** | int | NOT NULL, FOREIGN KEY → Achievement(Id) | Achievement earned |
| EarnedAt | DateTime | NOT NULL, DEFAULT NOW() | When it was earned |

### 1.7 Friendship Entity
| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| **Id** | int | PRIMARY KEY, NOT NULL, IDENTITY | Unique identifier |
| **RequesterId** | int | NOT NULL, FOREIGN KEY → User(Id) | User who sent request |
| **AddresseeId** | int | NOT NULL, FOREIGN KEY → User(Id) | User who received request |
| Status | FriendshipStatus enum | NOT NULL, DEFAULT Pending | Request status |
| RequestedAt | DateTime | NOT NULL, DEFAULT NOW() | When request was sent |
| RespondedAt | DateTime | NULL | When request was responded to |

---

## 2. Entity Relationships Matrix

| Entity | User | Habit | HabitLog | HabitReminder | Achievement | UserAchievement | Friendship |
|--------|------|-------|----------|---------------|-------------|-----------------|------------|
| **User** | - | True | True | False | False | True | True |
| **Habit** | True | - | True | True | False | False | False |
| **HabitLog** | True | True | - | False | False | False | False |
| **HabitReminder** | False | True | False | - | False | False | False |
| **Achievement** | False | False | False | False | - | True | False |
| **UserAchievement** | True | False | False | False | True | - | False |
| **Friendship** | True | False | False | False | False | False | - |

### Relationship Explanations:
- **User ↔ Habit**: Users own multiple habits
- **User ↔ HabitLog**: Users create multiple habit logs
- **User ↔ UserAchievement**: Users can earn multiple achievements
- **User ↔ Friendship**: Users can have multiple friend relationships (as requester or addressee)
- **Habit ↔ HabitLog**: Each habit can have multiple completion logs
- **Habit ↔ HabitReminder**: Each habit can have multiple reminders
- **Achievement ↔ UserAchievement**: Each achievement can be earned by multiple users

---

## 3. Entity-Relationship Sets and Mapping Cardinality

| Relationship Set | Entity 1 | Entity 2 | Cardinality | Foreign Key Location | Description |
|------------------|----------|----------|-------------|---------------------|-------------|
| **Owns** | User | Habit | 1:M | Habit.UserId | One user owns many habits |
| **Logs** | User | HabitLog | 1:M | HabitLog.UserId | One user creates many habit logs |
| **Tracks** | Habit | HabitLog | 1:M | HabitLog.HabitId | One habit has many log entries |
| **Reminds** | Habit | HabitReminder | 1:M | HabitReminder.HabitId | One habit can have many reminders |
| **Earns** | User | Achievement | M:N | UserAchievement (bridge table) | Many users can earn many achievements |
| **Requests** | User | User | M:N | Friendship (self-referencing) | Users can send/receive multiple friend requests |

### Detailed Cardinality Constraints:

1. **User → Habit** (1:M)
   - One user can create multiple habits
   - Each habit belongs to exactly one user
   - DELETE CASCADE: Deleting user removes all their habits

2. **User → HabitLog** (1:M)
   - One user can have multiple habit logs
   - Each log belongs to exactly one user
   - DELETE RESTRICT: Cannot delete user with existing logs

3. **Habit → HabitLog** (1:M)
   - One habit can have multiple log entries
   - Each log entry belongs to exactly one habit
   - DELETE CASCADE: Deleting habit removes all its logs

4. **Habit → HabitReminder** (1:M)
   - One habit can have multiple reminders
   - Each reminder belongs to exactly one habit
   - DELETE CASCADE: Deleting habit removes its reminders

5. **User ↔ Achievement** (M:N)
   - Many users can earn the same achievement
   - One user can earn multiple achievements
   - Bridge table: UserAchievement
   - DELETE CASCADE: Deleting user/achievement removes bridge records

6. **User ↔ User** (M:N via Friendship)
   - Self-referencing many-to-many relationship
   - One user can send requests to multiple users
   - One user can receive requests from multiple users
   - DELETE RESTRICT: Cannot delete user with active friendships

---

## 4. ER Diagram Description

### Visual Representation Structure:

```
                    ┌─────────────┐
                    │    USER     │
                    │ ════════════│
                    │ Id (PK)     │
                    │ Username    │
                    │ Email       │
                    │ PasswordHash│
                    │ FirstName   │
                    │ LastName    │
                    │ TotalPoints │
                    │ Level       │
                    │ ...         │
                    └─────────────┘
                           │
                           │ 1:M (Owns)
                           │
                    ┌─────────────┐       ┌─────────────────┐
                    │    HABIT    │ 1:M   │ HABIT_REMINDER  │
                    │ ════════════│──────▶│ ═══════════════ │
                    │ Id (PK)     │       │ Id (PK)         │
                    │ Name        │       │ HabitId (FK)    │
                    │ UserId (FK) │       │ ReminderTime    │
                    │ Type        │       │ Type            │
                    │ Category    │       │ IsActive        │
                    │ ...         │       │ ...             │
                    └─────────────┘       └─────────────────┘
                           │
                           │ 1:M (Tracks)
                           │
                    ┌─────────────┐
                    │ HABIT_LOG   │
                    │ ═══════════ │
                    │ Id (PK)     │
                    │ UserId (FK) │◄─────┐
                    │ HabitId(FK) │      │ 1:M (Logs)
                    │ LogDate     │      │
                    │ Status      │      │
                    │ Points      │      │
                    │ ...         │      │
                    └─────────────┘      │
                                        │
            ┌─────────────────────────────┘
            │
            ▼
    ┌─────────────┐        ┌───────────────────┐        ┌─────────────┐
    │    USER     │ M:N    │ USER_ACHIEVEMENT  │  M:N   │ ACHIEVEMENT │
    │ (repeated)  │◄──────▶│ ═════════════════ │◄──────▶│ ═══════════ │
    │             │        │ Id (PK)           │        │ Id (PK)     │
    │             │        │ UserId (FK)       │        │ Name        │
    │             │        │ AchievementId(FK) │        │ Description │
    │             │        │ EarnedAt          │        │ Type        │
    │             │        └───────────────────┘        │ Points      │
    │             │                                     │ ...         │
    │             │        ┌─────────────────┐          └─────────────┘
    │             │ M:N    │   FRIENDSHIP    │
    │             │◄──────▶│ ═══════════════ │
    │             │        │ Id (PK)         │
    │             │        │ RequesterId(FK) │
    │             │        │ AddresseeId(FK) │
    │             │        │ Status          │
    │             │        │ RequestedAt     │
    │             │        └─────────────────┘
    └─────────────┘
```

### Entity Types:
- **Strong Entities**: User, Habit, Achievement (have independent existence)
- **Weak Entities**: HabitLog, HabitReminder, UserAchievement, Friendship (depend on other entities)

### Relationship Types:
- **Binary Relationships**: All relationships involve exactly two entity types
- **Self-Referencing**: Friendship (User relates to User)
- **Bridge Entity**: UserAchievement (resolves M:N between User and Achievement)

### Key Attributes:
- **Primary Keys**: All entities have integer Id as primary key
- **Foreign Keys**: Referenced entities linked via foreign keys
- **Composite Unique**: (UserId, HabitId, LogDate) in HabitLog ensures one log per habit per day
- **Composite Unique**: (UserId, AchievementId) prevents duplicate achievements

---

## 5. Relational Schema

### 5.1 User Table
```sql
CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    TotalPoints INTEGER NOT NULL DEFAULT 0,
    Level INTEGER NOT NULL DEFAULT 1,
    CurrentStreak INTEGER NOT NULL DEFAULT 0,
    LongestStreak INTEGER NOT NULL DEFAULT 0,
    
    CHECK (TotalPoints >= 0),
    CHECK (Level >= 1),
    CHECK (CurrentStreak >= 0),
    CHECK (LongestStreak >= 0)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_users_username ON Users(Username);
```

### 5.2 Habit Table
```sql
CREATE TABLE Habits (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Description TEXT,
    UserId INTEGER NOT NULL,
    Type INTEGER NOT NULL DEFAULT 0, -- HabitType enum
    Category INTEGER NOT NULL DEFAULT 4, -- HabitCategory enum  
    TargetCount INTEGER NOT NULL DEFAULT 1,
    Unit VARCHAR(50),
    ReminderTime TIME,
    DaysOfWeek TEXT, -- JSON array
    PointsReward INTEGER NOT NULL DEFAULT 10,
    IsActive BOOLEAN NOT NULL DEFAULT true,
    IsPublic BOOLEAN NOT NULL DEFAULT false,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    CurrentStreak INTEGER NOT NULL DEFAULT 0,
    BestStreak INTEGER NOT NULL DEFAULT 0,
    CompletionCount INTEGER NOT NULL DEFAULT 0,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    
    CHECK (TargetCount > 0),
    CHECK (PointsReward >= 0),
    CHECK (CurrentStreak >= 0),
    CHECK (BestStreak >= 0),
    CHECK (CompletionCount >= 0)
);

-- Indexes for performance
CREATE INDEX idx_habits_user_id ON Habits(UserId);
CREATE INDEX idx_habits_category ON Habits(Category);
CREATE INDEX idx_habits_active ON Habits(IsActive);
```

### 5.3 HabitLog Table
```sql
CREATE TABLE HabitLogs (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER NOT NULL,
    HabitId INTEGER NOT NULL,
    LogDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Status INTEGER NOT NULL DEFAULT 0, -- HabitLogStatus enum
    CompletedCount INTEGER NOT NULL DEFAULT 1,
    TargetCount INTEGER NOT NULL DEFAULT 1,
    Notes VARCHAR(500),
    PointsEarned INTEGER NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE RESTRICT,
    FOREIGN KEY (HabitId) REFERENCES Habits(Id) ON DELETE CASCADE,
    
    UNIQUE(UserId, HabitId, LogDate),
    
    CHECK (CompletedCount >= 0),
    CHECK (TargetCount > 0),
    CHECK (PointsEarned >= 0)
);

-- Indexes for performance and queries
CREATE INDEX idx_habitlogs_user_id ON HabitLogs(UserId);
CREATE INDEX idx_habitlogs_habit_id ON HabitLogs(HabitId);
CREATE INDEX idx_habitlogs_date ON HabitLogs(LogDate);
CREATE INDEX idx_habitlogs_user_date ON HabitLogs(UserId, LogDate);
```

### 5.4 HabitReminder Table
```sql
CREATE TABLE HabitReminders (
    Id SERIAL PRIMARY KEY,
    HabitId INTEGER NOT NULL,
    ReminderTime TIME NOT NULL,
    Type INTEGER NOT NULL DEFAULT 0, -- ReminderType enum
    CustomSchedule TEXT, -- JSON for custom schedules
    Message VARCHAR(200),
    IsActive BOOLEAN NOT NULL DEFAULT true,
    LastSent TIMESTAMP,
    NextScheduled TIMESTAMP,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (HabitId) REFERENCES Habits(Id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_reminders_habit_id ON HabitReminders(HabitId);
CREATE INDEX idx_reminders_active ON HabitReminders(IsActive);
CREATE INDEX idx_reminders_next_scheduled ON HabitReminders(NextScheduled);
```

### 5.5 Achievement Table
```sql
CREATE TABLE Achievements (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Description TEXT,
    Type INTEGER NOT NULL DEFAULT 1, -- AchievementType enum
    RequiredValue INTEGER NOT NULL DEFAULT 1,
    Category VARCHAR(50),
    PointsReward INTEGER NOT NULL DEFAULT 50,
    BadgeIcon VARCHAR(100),
    IsActive BOOLEAN NOT NULL DEFAULT true,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CHECK (RequiredValue > 0),
    CHECK (PointsReward >= 0)
);

-- Indexes for performance
CREATE INDEX idx_achievements_type ON Achievements(Type);
CREATE INDEX idx_achievements_active ON Achievements(IsActive);
```

### 5.6 UserAchievement Table (Bridge Table)
```sql
CREATE TABLE UserAchievements (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER NOT NULL,
    AchievementId INTEGER NOT NULL,
    EarnedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (AchievementId) REFERENCES Achievements(Id) ON DELETE CASCADE,
    
    UNIQUE(UserId, AchievementId) -- Prevent duplicate achievements
);

-- Indexes for performance
CREATE INDEX idx_user_achievements_user_id ON UserAchievements(UserId);
CREATE INDEX idx_user_achievements_achievement_id ON UserAchievements(AchievementId);
```

### 5.7 Friendship Table
```sql
CREATE TABLE Friendships (
    Id SERIAL PRIMARY KEY,
    RequesterId INTEGER NOT NULL,
    AddresseeId INTEGER NOT NULL,
    Status INTEGER NOT NULL DEFAULT 0, -- FriendshipStatus enum
    RequestedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    RespondedAt TIMESTAMP,
    
    FOREIGN KEY (RequesterId) REFERENCES Users(Id) ON DELETE RESTRICT,
    FOREIGN KEY (AddresseeId) REFERENCES Users(Id) ON DELETE RESTRICT,
    
    UNIQUE(RequesterId, AddresseeId),
    CHECK (RequesterId != AddresseeId) -- Prevent self-friendship
);

-- Indexes for performance
CREATE INDEX idx_friendships_requester ON Friendships(RequesterId);
CREATE INDEX idx_friendships_addressee ON Friendships(AddresseeId);
CREATE INDEX idx_friendships_status ON Friendships(Status);
```

---

## Summary

This database design supports a comprehensive habit tracking system with:

- **7 Main Entities**: User, Habit, HabitLog, HabitReminder, Achievement, UserAchievement, Friendship
- **6 Relationship Types**: Ranging from simple 1:M to complex M:N relationships
- **Data Integrity**: Primary keys, foreign keys, check constraints, and unique constraints
- **Performance Optimization**: Strategic indexes on commonly queried columns
- **Scalability**: Normalized design that minimizes redundancy
- **Flexibility**: JSON fields for extensible data, enum types for controlled values
- **Security**: Password hashing, user-specific data isolation

The schema supports all planned features including gamification, social interactions, habit tracking, reminders, and comprehensive analytics.

---

**Database Engine**: PostgreSQL  
**ORM**: Entity Framework Core  
**Generated**: December 2024
