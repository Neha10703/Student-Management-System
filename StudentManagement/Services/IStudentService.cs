using StudentManagement.DTOs;

namespace StudentManagement.Services
{
    // Defines the business logic operations available for students
    public interface IStudentService
    {
        Task<List<StudentResponseDto>> GetAllAsync();

        Task<StudentResponseDto?> GetByIdAsync(int id);

        Task<StudentResponseDto> AddAsync(StudentDto dto);

        Task<StudentResponseDto?> UpdateAsync(int id, StudentDto dto);

        Task<bool> DeleteAsync(int id);
    }
}
