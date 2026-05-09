using Microsoft.EntityFrameworkCore;
using StudentManagement.Data;
using StudentManagement.Models;

namespace StudentManagement.Repositories
{
    // Handles all direct database operations for students
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _db;

        public StudentRepository(AppDbContext db)
        {
            _db = db;
        }

        // Get all students from the database
        public async Task<List<Student>> GetAllAsync()
        {
            return await _db.Students.ToListAsync();
        }

        // Get a single student by their ID, returns null if not found
        public async Task<Student?> GetByIdAsync(int id)
        {
            return await _db.Students.FindAsync(id);
        }

        // Add a new student and save to database
        public async Task<Student> AddAsync(Student student)
        {
            _db.Students.Add(student);
            await _db.SaveChangesAsync();
            return student;
        }

        // Update an existing student's details
        public async Task<Student?> UpdateAsync(int id, Student updatedStudent)
        {
            var existingStudent = await _db.Students.FindAsync(id);

            if (existingStudent == null)
            {
                return null;
            }

            existingStudent.Name   = updatedStudent.Name;
            existingStudent.Email  = updatedStudent.Email;
            existingStudent.Age    = updatedStudent.Age;
            existingStudent.Course = updatedStudent.Course;

            await _db.SaveChangesAsync();
            return existingStudent;
        }

        // Delete a student by ID, returns true if deleted, false if not found
        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _db.Students.FindAsync(id);

            if (student == null)
            {
                return false;
            }

            _db.Students.Remove(student);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
