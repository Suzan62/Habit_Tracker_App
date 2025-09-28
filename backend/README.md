# Habit Tracker Backend API

ASP.NET Core Web API for the Habit Tracker System, providing RESTful endpoints for habit management, user data, and analytics.

## Features

- RESTful API architecture
- Entity Framework Core with SQL Server
- Comprehensive habit management system
- Analytics and reporting capabilities
- Gamification features support
- Social features foundation
- CORS enabled for frontend integration
- Swagger API documentation

## Technology Stack

- **ASP.NET Core 9.0**: Web API framework
- **Entity Framework Core 9.0**: ORM for database operations
- **SQL Server**: Primary database
- **Swagger/OpenAPI**: API documentation
- **JWT Bearer**: Authentication (planned)

## Project Structure

```
backend/
├── Controllers/            # API endpoint controllers
│   └── HabitsController.cs # Habit management endpoints
├── Models/                 # Database entity models
│   ├── User.cs            # User profile and gamification
│   ├── Habit.cs           # Habit definitions
│   ├── HabitLog.cs        # Daily completion tracking
│   ├── HabitReminder.cs   # Notification scheduling
│   ├── Achievement.cs     # Gamification achievements
│   └── Friendship.cs      # Social connections
├── Data/
│   └── HabitTrackerContext.cs # Entity Framework context
├── Program.cs             # Application startup and configuration
├── appsettings.json       # Configuration settings
└── HabitTrackerAPI.csproj # Project dependencies
```

## Database Models

### Core Models

#### User
```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    // Gamification properties
    public int TotalPoints { get; set; }
    public int Level { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    // Navigation properties
    public ICollection<Habit> Habits { get; set; }
    public ICollection<HabitLog> HabitLogs { get; set; }
}
```

#### Habit
```csharp
public class Habit
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public HabitType Type { get; set; } // Daily, Weekly, Monthly
    public HabitCategory Category { get; set; }
    public int TargetCount { get; set; }
    public string Unit { get; set; }
    public int PointsReward { get; set; }
    public bool IsActive { get; set; }
    // Navigation properties
    public User User { get; set; }
    public ICollection<HabitLog> HabitLogs { get; set; }
}
```

#### HabitLog
```csharp
public class HabitLog
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int HabitId { get; set; }
    public DateTime LogDate { get; set; }
    public HabitLogStatus Status { get; set; } // Completed, Skipped, Partial
    public int CompletedCount { get; set; }
    public int PointsEarned { get; set; }
    public string Notes { get; set; }
}
```

## API Endpoints

### Habits Controller

#### Get All Habits
```http
GET /api/habits
```
Returns all habits with user and log data.

#### Get Habit by ID
```http
GET /api/habits/{id}
```
Returns a specific habit with related data.

#### Get User Habits
```http
GET /api/habits/user/{userId}
```
Returns all habits for a specific user.

#### Create Habit
```http
POST /api/habits
Content-Type: application/json

{
  "name": "Drink 8 glasses of water",
  "description": "Stay hydrated throughout the day",
  "userId": 1,
  "category": "Health",
  "type": "Daily",
  "targetCount": 8,
  "unit": "glasses",
  "pointsReward": 10
}
```

#### Update Habit
```http
PUT /api/habits/{id}
Content-Type: application/json

{
  "id": 1,
  "name": "Updated habit name",
  "description": "Updated description",
  // ... other properties
}
```

#### Delete Habit
```http
DELETE /api/habits/{id}
```

#### Log Habit Completion
```http
POST /api/habits/{id}/log
Content-Type: application/json

{
  "logDate": "2025-01-15",
  "status": "Completed",
  "completedCount": 8,
  "targetCount": 8,
  "notes": "Completed successfully"
}
```

#### Get Habit Analytics
```http
GET /api/habits/{id}/analytics?startDate=2025-01-01&endDate=2025-01-31
```

Response:
```json
{
  "totalDays": 31,
  "completedDays": 25,
  "skippedDays": 3,
  "completionRate": 80.65,
  "currentStreak": 5,
  "totalPoints": 250,
  "logs": [...]
}
```

## Getting Started

### Prerequisites

- .NET SDK 9.0 or later
- SQL Server or SQL Server Express LocalDB
- Visual Studio 2022 or VS Code (optional)

### Installation & Setup

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Configure database connection**
   
   Update `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HabitTrackerDB;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Install Entity Framework tools (if not installed globally)**
   ```bash
   dotnet tool install --global dotnet-ef
   ```

5. **Create and apply database migrations**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

6. **Run the application**
   ```bash
   dotnet run
   ```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

### Development Commands

```bash
# Run in development mode
dotnet run

# Run with hot reload
dotnet watch run

# Build the project
dotnet build

# Run tests
dotnet test

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

## Configuration

### Environment Settings

#### Development (appsettings.Development.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HabitTrackerDB_Dev;Trusted_Connection=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

#### Production (appsettings.Production.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-prod-server;Database=HabitTrackerDB;User Id=your-user;Password=your-password;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  }
}
```

## Error Handling

The API implements standard HTTP status codes:

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

Error responses include descriptive messages:

```json
{
  "error": "Habit not found",
  "details": "No habit exists with ID 999"
}
```

## CORS Configuration

CORS is configured to allow requests from the React frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

## Database Migrations

### Creating Migrations
```bash
# Add a new migration
dotnet ef migrations add AddNewFeature

# Add migration with specific context
dotnet ef migrations add AddNewFeature --context HabitTrackerContext
```

### Applying Migrations
```bash
# Update to latest migration
dotnet ef database update

# Update to specific migration
dotnet ef database update MigrationName

# Update production database
dotnet ef database update --environment Production
```

### Migration Best Practices

1. Always review generated migrations before applying
2. Test migrations on development database first
3. Backup production database before applying migrations
4. Use descriptive migration names
5. Never edit applied migrations directly

## Testing

### Unit Tests
```bash
# Run all tests
dotnet test

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test class
dotnet test --filter "HabitsControllerTests"
```

### Integration Tests
Test the API endpoints with a test database:

```csharp
[Test]
public async Task CreateHabit_ReturnsCreatedHabit()
{
    var habit = new Habit { Name = "Test Habit", UserId = 1 };
    var response = await _client.PostAsJsonAsync("/api/habits", habit);
    
    Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);
}
```

## Deployment

### Development Deployment

1. **Build the application**
   ```bash
   dotnet build --configuration Release
   ```

2. **Publish the application**
   ```bash
   dotnet publish --configuration Release --output ./publish
   ```

### Production Deployment

#### Azure App Service
1. Create App Service in Azure Portal
2. Configure connection string in Azure
3. Deploy using Azure CLI or Visual Studio

#### Docker Deployment
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["HabitTrackerAPI.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HabitTrackerAPI.dll"]
```

### Environment Variables for Production

- `ConnectionStrings__DefaultConnection`: Database connection string
- `ASPNETCORE_ENVIRONMENT`: Set to "Production"
- `JWT_SECRET_KEY`: Secret key for JWT authentication (when implemented)

## Security Considerations

### Current Security
- Input validation with data annotations
- HTTPS enforcement in production
- CORS configuration for allowed origins
- SQL injection prevention through EF Core

### Planned Security Features
- JWT authentication and authorization
- Password hashing with bcrypt
- Rate limiting for API endpoints
- Input sanitization and validation
- Audit logging for data changes

## Monitoring & Logging

### Application Insights (Planned)
```csharp
builder.Services.AddApplicationInsightsTelemetry();
```

### Custom Logging
```csharp
private readonly ILogger<HabitsController> _logger;

public IActionResult GetHabits()
{
    _logger.LogInformation("Fetching all habits");
    // ... implementation
}
```

## API Versioning (Planned)

```csharp
builder.Services.AddApiVersioning(opt =>
{
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
});
```

## Performance Optimization

- Database query optimization with proper indexing
- Async/await patterns for non-blocking operations
- Response caching for frequently accessed data
- Database connection pooling
- Efficient pagination for large datasets

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Real-time notifications with SignalR
- [ ] Background services for reminders
- [ ] Caching layer with Redis
- [ ] API rate limiting
- [ ] Health checks and monitoring
- [ ] Automated testing pipeline
- [ ] Database seeding for development
- [ ] Comprehensive logging and monitoring
