Student Management System
A full-stack Student Management System built with ASP.NET Core 8 Web API and React 18 (Vite). 
The system provides a secure RESTful backend with JWT-based authentication and a modern single-page application frontend for managing student records.

Tech Stack
### Backend
| Technology | Version | Purpose |

| ASP.NET Core Web API | .NET 8 | REST API framework |
| Entity Framework Core | 8.0.0 | ORM for database access |
| SQL Server LocalDB | 15.x | Relational database |
| JWT Bearer Authentication | 8.0.0 | Stateless auth via JSON Web Tokens |
| BCrypt.Net-Next | 4.1.0 | Password hashing |
| Serilog | 8.0.0 | Structured logging to console and file |
| Swashbuckle (Swagger) | 6.5.0 | API documentation and testing UI |

### Frontend
| Technology | Version | Purpose |

| React | 18.x | UI component library |
| Vite | 5.x | Frontend build tool and dev server |
| React Router DOM | 6.x | Client-side routing |
| Axios | 1.x | HTTP client with interceptors |
| React Hot Toast | 2.x | Toast notification system |
| Lucide React | 0.x | Icon library |

### Backend Project Structure
StudentManagement/
├── Controllers/
│   ├── AuthController.cs        # Register & Login endpoints
│   └── StudentsController.cs    # CRUD endpoints for students
├── Data/
│   └── AppDbContext.cs          # EF Core DbContext (Students + Users tables)
├── DTOs/
│   ├── AuthDto.cs               # RegisterDto, LoginDto, AuthResponseDto
│   └── StudentDto.cs            # StudentDto, StudentResponseDto
├── Middleware/
│   └── ExceptionMiddleware.cs   # Global unhandled exception handler
├── Migrations/                  # EF Core auto-generated migrations
├── Models/
│   ├── Student.cs               # Student entity
│   └── User.cs                  # User entity
├── Repositories/
│   ├── IStudentRepository.cs    # Repository interface
│   └── StudentRepository.cs    # EF Core repository implementation
├── Services/
│   ├── AuthService.cs           # Registration and login business logic
│   ├── IStudentService.cs       # Service interface
│   ├── StudentService.cs        # Student business logic + DTO mapping
│   └── TokenService.cs          # JWT token generation
├── appsettings.json             # Configuration (DB, JWT, Serilog)
└── Program.cs                   # App bootstrap, DI registration, middleware pipeline


### Frontend Project Structure

student-ui/src/
├── api/
│   └── client.js           # Axios instance with JWT interceptor + auto logout on 401
├── context/
│   └── AuthContext.jsx     # Global auth state (token, user, login, register, logout)
├── components/
│   ├── Layout.jsx           # Protected route wrapper with sidebar + header
│   ├── Sidebar.jsx          # Navigation sidebar
│   ├── Header.jsx           # Top header bar
│   ├── Modal.jsx            # Reusable modal dialog
│   └── StudentForm.jsx      # Shared Add/Edit student form with validation
└── pages/
    ├── Login.jsx            # Login + Register tabs
    ├── Dashboard.jsx        # Stats overview + recent students + course chart
    └── Students.jsx         # Full CRUD table with search, filter, pagination
    
## Authentication Flow
User registers via POST /api/auth/register — password is hashed with BCrypt before storage

User logs in via POST /api/auth/login — BCrypt verifies the password against the stored hash

On success, the server returns a signed JWT token using HMAC-SHA256 with 8-hour expiry

The React client stores the token in localStorage and attaches it to every subsequent request via an Axios request interceptor as Authorization: Bearer token

If any request returns 401 Unauthorized, the interceptor automatically clears the token and redirects to /login

All student endpoints are protected with the Authorize attribute — requests without a valid token are rejected

## API Endpoints
Auth
POST /api/auth/register — No auth required — Register a new user account

POST /api/auth/login — No auth required — Login and receive a JWT token

Students
GET /api/students — Auth required — Retrieve all students

GET /api/students/{id} — Auth required — Retrieve a student by ID

POST /api/students — Auth required — Create a new student record

PUT /api/students/{id} — Auth required — Update an existing student

DELETE /api/students/{id} — Auth required — Delete a student by ID

# Database Schema
Students Table
Id — INT — PRIMARY KEY, IDENTITY

Name — NVARCHAR — NOT NULL

Email — NVARCHAR — NOT NULL

Age — INT — NOT NULL

Course — NVARCHAR — NOT NULL

CreatedDate — DATETIME2 — NOT NULL, defaults to UTC

Users Table
Id — INT — PRIMARY KEY, IDENTITY

FullName — NVARCHAR — NOT NULL

Username — NVARCHAR — NOT NULL, UNIQUE

Email — NVARCHAR — NOT NULL, UNIQUE

PasswordHash — NVARCHAR — NOT NULL, BCrypt hash

CreatedDate — DATETIME2 — NOT NULL, defaults to UTC


---
