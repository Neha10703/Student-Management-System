using StudentManagement.DTOs;
using StudentManagement.Models;
using StudentManagement.Repositories;

namespace StudentManagement.Services
{
    // Contains the business logic for managing students
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repository;

        public StudentService(IStudentRepository repository)
        {
            _repository = repository;
        }

        // Get all students and convert them to response DTOs
        public async Task<List<StudentResponseDto>> GetAllAsync()
        {
            var students = await _repository.GetAllAsync();

            var result = new List<StudentResponseDto>();
            foreach (var student in students)
            {
                result.Add(MapToResponse(student));
            }

            return result;
        }

        // Get a single student by ID
        public async Task<StudentResponseDto?> GetByIdAsync(int id)
        {
            var student = await _repository.GetByIdAsync(id);

            if (student == null)
            {
                return null;
            }

            return MapToResponse(student);
        }

        // Add a new student
        public async Task<StudentResponseDto> AddAsync(StudentDto dto)
        {
            var student = MapToEntity(dto);
            var savedStudent = await _repository.AddAsync(student);
            return MapToResponse(savedStudent);
        }

        // Update an existing student
        public async Task<StudentResponseDto?> UpdateAsync(int id, StudentDto dto)
        {
            var student = MapToEntity(dto);
            var updatedStudent = await _repository.UpdateAsync(id, student);

            if (updatedStudent == null)
            {
                return null;
            }

            return MapToResponse(updatedStudent);
        }

        // Delete a student by ID
        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        // Convert a StudentDto (request) into a Student entity
        private Student MapToEntity(StudentDto dto)
        {
            return new Student
            {
                Name   = dto.Name,
                Email  = dto.Email,
                Age    = dto.Age,
                Course = dto.Course
            };
        }

        // Convert a Student entity into a StudentResponseDto (response)
        private StudentResponseDto MapToResponse(Student student)
        {
            return new StudentResponseDto
            {
                Id          = student.Id,
                Name        = student.Name,
                Email       = student.Email,
                Age         = student.Age,
                Course      = student.Course,
                CreatedDate = student.CreatedDate
            };
        }
    }
}
