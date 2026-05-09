using System.ComponentModel.DataAnnotations;

namespace StudentManagement.DTOs
{
    // Used when creating or updating a student (incoming request body)
    public class StudentDto
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        public string Email { get; set; } = string.Empty;

        [Range(1, 100, ErrorMessage = "Age must be between 1 and 100")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Course is required")]
        public string Course { get; set; } = string.Empty;
    }

    // Used when returning student data to the client (outgoing response)
    public class StudentResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int Age { get; set; }

        public string Course { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; }
    }
}
