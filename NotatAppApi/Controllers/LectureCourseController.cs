using Microsoft.AspNetCore.Mvc;
using NotatAppApi.Models;
using NotatAppApi.Repositories.Interfaces;

namespace NotatAppApi.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class LectureCourseController(ILectureCourseRepository lectureCourseRepository, ILogger<LectureCourseController> logger) : ControllerBase
    {
        private readonly ILectureCourseRepository _lectureRepository = lectureCourseRepository;
        private readonly ILogger<LectureCourseController> _logger = logger;

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var LectureCourses = await _lectureRepository.GetAll();
            if (LectureCourses == null)
            {
                _logger.LogError("[LectureCourseController - GetAll] LectureCourse list not found");
                return NotFound("LectureCourses not found");
            }

            return Ok(LectureCourses);
        }

        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var LectureCourse = await _lectureRepository.GetById(id);
            if (LectureCourse == null)
            {
                _logger.LogError("[LectureCourseController - GetById] LectureCourse not found");
                return NotFound("LectureCourse not found");
            }

            return Ok(LectureCourse);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] LectureCourse lectureCourse)
        {
            if (lectureCourse == null)
            {
                _logger.LogError("[LectureCourseController - Create] LectureCourse cannot be null");
                return BadRequest("LectureCourse cannot be null");
            }

            bool returnOk = await _lectureRepository.Create(lectureCourse);
            if (returnOk) 
                return CreatedAtAction(nameof(GetAll), lectureCourse);

            _logger.LogError("[LectureCourseController - Create] LectureCourse creation failed");
            return StatusCode(500, "Internal server error");
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LectureCourse lectureCourse)
        {
            if (lectureCourse == null)
            {
                _logger.LogError("[LectureCourseController - Update] LectureCourse cannot be null");
                return BadRequest("LectureCourse cannot be null");
            }

            if (id != lectureCourse.LectureCourseId)
            {
                _logger.LogError("[LectureCourseController - Update] Ids must match");
                return BadRequest("Ids must match");
            }

            var existingLectureCourse = await _lectureRepository.GetById(id);
            if (existingLectureCourse == null)
            {
                _logger.LogError("[LectureCourseController - Update] LectureCourse not found");
                return NotFound("LectureCourse not found");
            }

            existingLectureCourse.Title = lectureCourse.Title;

            bool returnOk = await _lectureRepository.Update(existingLectureCourse);
            if (returnOk) 
                return Ok(existingLectureCourse);

            _logger.LogError("[LectureCourseController - Update] Update failed");
            return StatusCode(500, "Internal server error");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool returnOk = await _lectureRepository.Delete(id);
            if (returnOk)
                return NoContent();

            _logger.LogError("[LectureCourseController - Delete] Deletion failed");
            return BadRequest("Deletion failed");
        }
    }
}