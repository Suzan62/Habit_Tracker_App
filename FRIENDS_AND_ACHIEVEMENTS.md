# Friends and Achievements Features

This document explains the newly implemented Friends and Achievements features in your Habit Tracker app.

## 🤝 Friends Feature

The Friends feature allows users to connect with each other, send friend requests, and build a social community around habit building.

### Backend Implementation

**Controllers:**
- `UsersController.cs` - Search for users
- `FriendsController.cs` - Manage friendships

**Models:**
- `Friendship.cs` - Handles friendship relationships with statuses (Pending, Accepted, Declined, Blocked)

**DTOs:**
- `UserDto.cs` - User data transfer object
- `FriendshipDto.cs` - Friendship data transfer objects

### API Endpoints

#### User Search
- `GET /api/users/search?query={searchTerm}` - Search for users by username or name

#### Friend Management
- `POST /api/friends/send-request` - Send a friend request
- `GET /api/friends/requests` - Get pending friend requests
- `PUT /api/friends/requests/{id}` - Accept/decline friend requests
- `GET /api/friends` - Get list of accepted friends

### Frontend Implementation

**Screen:** `FriendsScreen.js`
- Search for users
- View friend requests
- Accept/decline requests
- View current friends list

**API Service:** `socialApi.js` - Contains all friends-related API calls

### How to Add Friends

1. **Search for Users**: Use the search bar in the Friends screen to find other users
2. **Send Friend Request**: Tap the "Add" button next to a user's name
3. **Accept/Decline Requests**: View incoming requests and respond accordingly
4. **View Friends**: See your accepted friends in the friends list

---

## 🏆 Achievements Feature

The Achievements feature gamifies the habit tracking experience by rewarding users for reaching specific milestones.

### Backend Implementation

**Controllers:**
- `AchievementsController.cs` - Manage achievements

**Models:**
- `Achievement.cs` - Achievement definitions
- `UserAchievement.cs` - User-earned achievements

**DTOs:**
- `AchievementDto.cs` - Achievement data transfer objects

### Achievement Types

1. **Streak** - Based on consecutive days
2. **Completion** - Based on total completions
3. **Point** - Based on points earned
4. **Social** - Based on social interactions
5. **Time** - Based on time-specific completions
6. **Category** - Based on specific habit categories

### API Endpoints

- `GET /api/achievements` - Get all available achievements
- `GET /api/achievements/my-achievements` - Get user's earned achievements

### Frontend Implementation

**Screen:** `AchievementsScreen.js`
- Display all available achievements
- Show user's progress and earned achievements
- Beautiful UI with badges and progress indicators

### Sample Achievements Included

#### Streak Achievements
- **First Steps** (1 day) - 10 points 🚀
- **Getting Started** (3 days) - 25 points 🌱
- **Week Warrior** (7 days) - 50 points 💪
- **Consistency King** (14 days) - 100 points 👑
- **Month Master** (30 days) - 200 points 🎯
- **Streak Legend** (100 days) - 500 points 🏆

#### Completion Achievements
- **Habit Creator** - Create first habit - 20 points ✨
- **Productive Day** - Complete 3 habits in one day - 30 points 🌟
- **Super Productive** - Complete 5 habits in one day - 50 points ⭐
- **Habit Master** - Complete 10 different habits - 100 points 🎖️

#### Social Achievements
- **Social Butterfly** - Add first friend - 30 points 🦋
- **Friend Collector** - Add 5 friends - 75 points 👥
- **Popular Person** - Add 10 friends - 150 points 🎉

---

## 🚀 Getting Started

### Database Setup

1. Run the sample achievements SQL script:
   ```sql
   -- Execute the contents of sample_achievements.sql in your database
   ```

### Backend Setup

The backend controllers are already integrated into your existing project. Make sure to:

1. Build and run your .NET API
2. Ensure the database migration includes the Friendship and Achievement tables

### Frontend Navigation

The new screens are accessible from the Dashboard:
- **Friends Button** (👥) - Opens the Friends screen
- **Achievements Button** (🏆) - Opens the Achievements screen

### Testing the Features

1. **Friends:**
   - Register multiple test users
   - Search for users using the search functionality
   - Send and accept friend requests

2. **Achievements:**
   - Create habits and complete them
   - Check the achievements screen to see progress
   - Achievements are automatically awarded based on your activity

---

## 📱 UI/UX Features

### Friends Screen
- **Search Bar** - Real-time user search
- **Friend Requests Section** - Accept/decline pending requests
- **Friends List** - View all accepted friends
- **Pull to Refresh** - Update data with swipe gesture

### Achievements Screen
- **Progress Header** - Shows X of Y achievements unlocked
- **Achievement Cards** - Beautiful cards with badges, descriptions, and points
- **Visual Indicators** - Clearly shows earned vs. unearned achievements
- **Category Organization** - Achievements organized by type

### Dashboard Integration
- **Quick Action Buttons** - Easy access to Friends and Achievements
- **Responsive Grid Layout** - Buttons arranged in a clean 2x3 grid

---

## 🔧 Technical Details

### Database Schema
- `Friendships` table tracks relationships between users
- `Achievements` table stores achievement definitions
- `UserAchievements` junction table tracks earned achievements

### Authentication
- All endpoints require JWT authentication
- User context automatically extracted from JWT tokens

### Error Handling
- Comprehensive error handling with user-friendly messages
- Loading states and refresh capabilities

### Performance
- Efficient queries with proper database indexes
- Minimal API calls with data caching where appropriate

---

## 🎯 Future Enhancements

Potential future additions:
- **Achievement Notifications** - Push notifications when achievements are earned
- **Friend Activity Feed** - See friends' habit completions
- **Leaderboards** - Compete with friends on streaks and points
- **Achievement Progress Tracking** - Show progress toward unearned achievements
- **Custom Achievements** - Allow users to create personal goals

---

## 🐛 Troubleshooting

### Common Issues

1. **Friends not showing up**: Ensure both users are registered and the search is using correct usernames
2. **Achievements not loading**: Verify the sample achievements have been inserted into the database
3. **Navigation issues**: Ensure all screen imports are correctly added to App.js

### Database Issues
- Make sure your database connection string is correct
- Verify that migrations have been applied
- Check that sample data has been inserted

---

Enjoy building habits with your friends and earning achievements! 🎉
