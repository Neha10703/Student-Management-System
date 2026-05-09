using Microsoft.EntityFrameworkCore;
using StudentManagement.Models;

namespace StudentManagement.Data
{
    // This is the main database context that Entity Framework uses
    // to talk to SQL Server
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Represents the Students table in the database
        public DbSet<Student> Students { get; set; }

        // Represents the Users table in the database
        public DbSet<User> Users { get; set; }
    }
}
