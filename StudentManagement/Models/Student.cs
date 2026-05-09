namespace StudentManagement.Models
{
    // Represents a student record in the database
    public class Student
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int Age { get; set; }

        public string Course { get; set; } = string.Empty;

        // Automatically set to current UTC time when a student is created
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
