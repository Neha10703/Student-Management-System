using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.DTOs;
using StudentManagement.Services;

namespace StudentManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints require a valid JWT token
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        // GET api/students
        // Returns a list of all students
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _studentService.GetAllAsync();
            return Ok(students);
        }

        // GET api/students/5
        // Returns a single student by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _studentService.GetByIdAsync(id);

            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} was not found" });
            }

            return Ok(student);
        }

        // POST api/students
        // Creates a new student
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StudentDto dto)
        {
            var createdStudent = await _studentService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdStudent.Id }, createdStudent);
        }

        // PUT api/students/5
        // Updates an existing student
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] StudentDto dto)
        {
            var updatedStudent = await _studentService.UpdateAsync(id, dto);

            if (updatedStudent == null)
            {
                return NotFound(new { message = $"Student with ID {id} was not found" });
            }

            return Ok(updatedStudent);
        }

        // DELETE api/students/5
        // Deletes a student by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool wasDeleted = await _studentService.DeleteAsync(id);

            if (!wasDeleted)
            {
                return NotFound(new { message = $"Student with ID {id} was not found" });
            }

            return NoContent();
        }
    }
}
