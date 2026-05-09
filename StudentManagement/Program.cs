using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using StudentManagement.Data;
using StudentManagement.Middleware;
using StudentManagement.Repositories;
using StudentManagement.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── Logging ────────────────────────────────────────────────────────────────
// Use Serilog for structured logging to console and file
builder.Host.UseSerilog((context, loggerConfig) =>
{
    loggerConfig.ReadFrom.Configuration(context.Configuration);
});

// ─── Database ────────────────────────────────────────────────────────────────
// Connect to SQL Server using the connection string from appsettings.json
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// ─── Dependency Injection ────────────────────────────────────────────────────
// Register repository and service layers
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<AuthService>();

// ─── JWT Authentication ──────────────────────────────────────────────────────
// Read JWT settings from appsettings.json and configure Bearer token validation
string jwtKey    = builder.Configuration["Jwt:Key"]!;
string jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
string jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow the React frontend running on localhost:5173 to call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactUI", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ─── Swagger ─────────────────────────────────────────────────────────────────
// Set up Swagger UI with JWT authorization support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title   = "Student Management API",
        Version = "v1"
    });

    // Add the Authorize button in Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name        = "Authorization",
        Type        = SecuritySchemeType.Http,
        Scheme      = "Bearer",
        BearerFormat = "JWT",
        In          = ParameterLocation.Header,
        Description = "Enter your JWT token here"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            new List<string>()
        }
    });
});

// ─── Build App ───────────────────────────────────────────────────────────────
var app = builder.Build();

// ─── Auto Migrate Database ───────────────────────────────────────────────────
// Automatically apply any pending EF Core migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ─── Middleware Pipeline ─────────────────────────────────────────────────────
app.UseMiddleware<ExceptionMiddleware>(); // Global error handler
app.UseCors("ReactUI");                  // Allow React frontend
app.UseSwagger();                        // Enable Swagger JSON
app.UseSwaggerUI();                      // Enable Swagger UI page
app.UseAuthentication();                 // Validate JWT tokens
app.UseAuthorization();                  // Enforce [Authorize] attributes
app.MapControllers();                    // Map all API controllers

app.Run();
