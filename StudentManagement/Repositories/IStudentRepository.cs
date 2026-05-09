using StudentManagement.Models;

namespace StudentManagement.Repositories
{
    // Defines what database operations are available for students
    public interface IStudentRepository
    {
        Task<List<Student>> GetAllAsync();

        Task<Student?> GetByIdAsync(int id);

        Task<Student> AddAsync(Student student);

        Task<Student?> UpdateAsync(int id, Student updatedStudent);

        Task<bool> DeleteAsync(int id);
    }
}
