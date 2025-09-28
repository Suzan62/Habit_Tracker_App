# Habit Tracker System

A comprehensive habit tracking application built with React frontend and ASP.NET Core backend, featuring habit management, analytics, gamification, and social features.

## Features

### Core Functionality
- ✅ **Habit Management**: Create, read, update, and delete habits
- ✅ **Habit Logging**: Mark habits as completed, skipped, or partial
- ✅ **Categories**: Organize habits by categories (Health, Fitness, Learning, etc.)
- ✅ **Scheduling**: Set daily, weekly, or monthly habits
- ✅ **Progress Tracking**: View streaks, completion rates, and statistics

### Analytics & Reporting
- 📊 **Dashboard**: Overview of all habits and key metrics
- 📈 **Habit Analytics**: Individual habit statistics and trends
- 🎯 **Streak Tracking**: Current and best streaks for motivation
- 📅 **Historical Data**: Track progress over time

### Gamification Features
- 🏆 **Achievement System**: Unlock badges for milestones
- 🎖️ **Points & Levels**: Earn points and level up
- 🔥 **Streaks**: Visual streak counters and rewards
- 🎮 **Leaderboards**: Compare progress with friends

### Social Features
- 👥 **Friend System**: Add and manage friends
- 📱 **Habit Sharing**: Share habits publicly with friends
- 🏅 **Social Leaderboards**: Friendly competition
- 💬 **Community Features**: Engage with other users

### Notifications & Reminders
- ⏰ **Smart Reminders**: Customizable notification schedules
- 📱 **Multi-platform**: Web and mobile notifications
- 🎯 **Contextual Alerts**: Time and location-based reminders

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Axios**: HTTP client for API communication
- **Chart.js**: Data visualization for analytics
- **Material-UI**: Modern UI components and styling
- **React Router**: Navigation and routing

### Backend
- **ASP.NET Core 9.0**: Web API framework
- **Entity Framework Core**: Database ORM
- **SQL Server**: Primary database
- **JWT Authentication**: Secure user authentication
- **Swagger**: API documentation

### Database Models
- **User**: User management and profile data
- **Habit**: Habit definitions and settings
- **HabitLog**: Daily completion tracking
- **HabitReminder**: Notification scheduling
- **Achievement**: Gamification achievements
- **Friendship**: Social connections

## Project Structure

```
habit-tracker-system/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # API communication
│   │   └── App.js           # Main application component
│   └── package.json
├── backend/                  # ASP.NET Core API
│   ├── Controllers/          # API endpoints
│   ├── Models/              # Database models
│   ├── Data/                # Database context
│   └── Program.cs           # Application startup
├── docs/                    # Documentation
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- .NET SDK (9.0+)
- SQL Server or SQL Server Express LocalDB

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Update database connection string**
   Edit `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HabitTrackerDB;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Create and run database migrations**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. **Run the API server**
   ```bash
   dotnet run
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The React app will be available at `http://localhost:3000`

## API Endpoints

### Habits
- `GET /api/habits` - Get all habits
- `GET /api/habits/{id}` - Get single habit
- `GET /api/habits/user/{userId}` - Get user's habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/{id}` - Update habit
- `DELETE /api/habits/{id}` - Delete habit
- `POST /api/habits/{id}/log` - Log habit completion
- `GET /api/habits/{id}/analytics` - Get habit analytics

### Future Endpoints
- `/api/users` - User management
- `/api/auth` - Authentication
- `/api/achievements` - Achievement system
- `/api/friends` - Social features
- `/api/notifications` - Reminder system

## Development Status

### Completed ✅
- [x] Project structure and setup
- [x] Database models and relationships
- [x] Basic habit CRUD operations
- [x] React frontend with dashboard
- [x] Habit cards and management UI
- [x] API integration with axios

### In Progress 🚧
- [ ] Notification and reminder system
- [ ] Analytics and reporting with charts
- [ ] Gamification features (achievements, points)
- [ ] Social features (friends, sharing)

### Planned 📅
- [ ] User authentication system
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Data export/import
- [ ] Advanced analytics
- [ ] Third-party integrations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

### Backend Tests
```bash
cd backend
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
- Configure production database connection
- Set up environment variables
- Deploy to Azure App Service, AWS, or your preferred platform

### Frontend Deployment
- Build production bundle: `npm run build`
- Deploy to Netlify, Vercel, or static hosting service
- Configure environment variables for API endpoints

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web development best practices
- Inspired by popular habit tracking apps
- Community-driven feature requests and feedback

---

**Happy habit building! 🎯**
