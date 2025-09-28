using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using HabitTrackerAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework with PostgreSQL
builder.Services.AddDbContext<HabitTrackerContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services
builder.Services.AddScoped<HabitTrackerAPI.Services.IAuthService, HabitTrackerAPI.Services.AuthService>();
builder.Services.AddHostedService<BackgroundReminderService>();

// Use MockEmailService in development, real EmailService in production
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddScoped<HabitTrackerAPI.Services.IEmailService, HabitTrackerAPI.Services.MockEmailService>();
}
else
{
    builder.Services.AddScoped<HabitTrackerAPI.Services.IEmailService, HabitTrackerAPI.Services.EmailService>();
}

builder.Services.AddScoped<HabitTrackerAPI.Services.IGoogleAuthService, HabitTrackerAPI.Services.GoogleAuthService>();

// Configure settings
builder.Services.Configure<HabitTrackerAPI.Services.EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.Configure<HabitTrackerAPI.Services.GoogleAuthSettings>(builder.Configuration.GetSection("GoogleAuth"));

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity123";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http:// 192.168.0.104:8081")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        x.JsonSerializerOptions.WriteIndented = true;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
