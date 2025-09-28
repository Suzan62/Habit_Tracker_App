# 🎯 Habit Tracker System - Full Stack with Authentication

A comprehensive habit tracking application with **React frontend**, **ASP.NET Core backend**, **React Native mobile app**, featuring user authentication, habit management, analytics, gamification, and social features.

## ✨ Features Completed

### 🔐 Authentication System
- ✅ **JWT Authentication**: Secure login/register with token-based auth
- ✅ **Password Hashing**: BCrypt password security
- ✅ **User Registration**: Create account with email verification
- ✅ **Protected Routes**: API endpoints secured with JWT middleware
- ✅ **Session Management**: Automatic token handling and refresh

### 🗄️ Database & Backend
- ✅ **PostgreSQL Database**: Switched from SQL Server to PostgreSQL
- ✅ **Entity Framework Core**: Full ORM with migrations
- ✅ **RESTful API**: Complete CRUD operations for habits
- ✅ **User Management**: Profile and authentication endpoints
- ✅ **CORS Configuration**: Secure cross-origin requests

### 🌐 Web Application (React)
- ✅ **Authentication UI**: Login and Register pages
- ✅ **Protected Dashboard**: User-specific habit management
- ✅ **Responsive Design**: Mobile-friendly web interface
- ✅ **Real-time Updates**: Automatic data refresh
- ✅ **Context-based State**: React Context for authentication

### 📱 Mobile Application (React Native)
- ✅ **Expo Setup**: Cross-platform mobile development
- ✅ **Native Navigation**: Stack-based navigation system
- ✅ **Mobile Authentication**: Touch-friendly login/register
- ✅ **Native UI Components**: Platform-specific styling
- ✅ **AsyncStorage**: Secure token storage
- ✅ **API Integration**: Full backend connectivity

### 📊 Core Functionality
- ✅ **Habit Management**: Create, edit, delete, and track habits
- ✅ **Habit Logging**: Mark habits as completed, skipped, or partial
- ✅ **Categories**: Organize habits by type (Health, Fitness, etc.)
- ✅ **Streaks**: Track current and best streaks
- ✅ **Progress Statistics**: Dashboard with key metrics

## 🏗️ Architecture

```
habit-tracker-system/
├── backend/                    # ASP.NET Core API
│   ├── Controllers/           # AuthController, HabitsController
│   ├── Models/               # User, Habit, HabitLog entities
│   ├── Services/             # AuthService, JWT handling
│   ├── Data/                 # Entity Framework context
│   └── DTOs/                 # Data transfer objects
├── frontend/                  # React Web App
│   ├── src/
│   │   ├── components/       # Login, Register, Dashboard, HabitCard
│   │   ├── context/          # Authentication context
│   │   └── services/         # API service layer
├── mobile/                   # React Native App
│   ├── src/
│   │   ├── screens/          # LoginScreen, RegisterScreen, DashboardScreen
│   │   ├── components/       # HabitCard, UI components
│   │   ├── context/          # Authentication context
│   │   └── services/         # API service layer
└── docs/                     # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- .NET SDK (9.0+)
- PostgreSQL database
- Expo CLI (for mobile development)

### 1. Database Setup

**Install PostgreSQL** and create database:
```sql
CREATE DATABASE HabitTrackerDB;
CREATE USER habituser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE HabitTrackerDB TO habituser;
```

### 2. Backend Setup

```bash
cd backend

# Restore packages
dotnet restore

# Update connection string in appsettings.json
# Then run migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API
dotnet run
```

API will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Web app will be available at `http://localhost:3000`

### 4. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on device/simulator
npm run android  # Android
npm run ios      # iOS (macOS only)
npm run web      # Web preview
```

## 🔐 Authentication Flow

### Registration
1. User fills registration form (username, email, password)
2. Backend validates and hashes password with BCrypt
3. JWT token generated and returned
4. User automatically logged in

### Login
1. User provides email/password
2. Backend verifies credentials
3. JWT token issued for session
4. Token stored locally (localStorage/AsyncStorage)

### API Security
- All habit endpoints require JWT authentication
- Tokens automatically included in API requests
- 401 responses trigger automatic logout

## 📱 Platform Features

### Web App
- **Desktop Optimized**: Full-featured dashboard
- **Responsive Design**: Works on tablets and mobile browsers
- **Keyboard Navigation**: Accessible interface
- **Real-time Updates**: Live data synchronization

### Mobile App
- **Native Performance**: Smooth 60fps animations
- **Touch Gestures**: Swipe and tap interactions
- **Offline Support**: Local storage for offline viewing
- **Push Notifications**: Habit reminders (planned)

## 🛠️ Technology Stack

### Backend
- **ASP.NET Core 9.0**: Web API framework
- **Entity Framework Core**: Database ORM
- **PostgreSQL**: Primary database
- **JWT Bearer**: Authentication middleware
- **BCrypt.NET**: Password hashing
- **Swagger**: API documentation

### Frontend (Web)
- **React 18**: Modern hooks-based UI
- **Context API**: State management
- **Axios**: HTTP client
- **CSS3**: Custom responsive styling

### Mobile
- **React Native**: Cross-platform mobile
- **Expo**: Development platform
- **React Navigation**: Native navigation
- **AsyncStorage**: Secure local storage
- **Platform-specific UI**: Native look and feel

### Database Models
- **User**: Authentication and profile data
- **Habit**: Habit definitions and settings
- **HabitLog**: Daily completion tracking
- **HabitReminder**: Notification scheduling
- **Achievement**: Gamification system
- **Friendship**: Social connections

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
```

### Habits
```
GET    /api/habits/my-habits      # Get current user's habits
GET    /api/habits/{id}           # Get specific habit
POST   /api/habits               # Create new habit
PUT    /api/habits/{id}          # Update habit
DELETE /api/habits/{id}          # Delete habit
POST   /api/habits/{id}/log      # Log habit completion
GET    /api/habits/{id}/analytics # Get habit analytics
```

## 🎨 User Experience

### Onboarding
1. **Welcome Screen**: Introduction to app features
2. **Registration**: Quick account creation
3. **First Habit**: Guided habit creation
4. **Dashboard Tour**: Feature walkthrough

### Daily Flow
1. **Login**: Quick authentication
2. **Dashboard**: View today's habits and progress
3. **Habit Logging**: Mark habits complete/skip
4. **Statistics**: View streaks and achievements

## 🔧 Configuration

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=HabitTrackerDB;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Key": "your-secret-key-min-32-chars",
    "ExpiryInHours": 24
  }
}
```

### Frontend Configuration
Update API URLs in:
- `frontend/src/services/api.js`
- `mobile/src/services/api.js`

## 🚀 Deployment

### Backend Deployment
- **Docker**: Containerized deployment ready
- **Azure**: App Service deployment
- **AWS**: ECS/Lambda deployment
- **Railway**: One-click PostgreSQL + API deployment

### Frontend Deployment
- **Vercel**: Automatic deployment from Git
- **Netlify**: Static site deployment
- **AWS S3**: Static website hosting

### Mobile Deployment
- **Expo EAS**: Build and deploy to app stores
- **Google Play**: Android app distribution
- **App Store**: iOS app distribution

## 🎯 Next Steps (Planned Features)

- [ ] **Push Notifications**: Mobile habit reminders
- [ ] **Analytics Dashboard**: Charts and insights
- [ ] **Social Features**: Friends and leaderboards  
- [ ] **Gamification**: Points, levels, achievements
- [ ] **Data Export**: Backup and migration
- [ ] **Dark Mode**: UI theme options
- [ ] **Offline Sync**: Full offline capability

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 You now have a complete habit tracking system with:**
- ✅ **Full Authentication** (JWT + BCrypt)
- ✅ **PostgreSQL Database**
- ✅ **React Web App** with responsive UI
- ✅ **React Native Mobile App** with native navigation
- ✅ **RESTful API** with proper security
- ✅ **Modern Architecture** with clean separation of concerns

**Ready for production deployment! 🚀**
