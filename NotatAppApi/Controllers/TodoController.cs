using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using NotatAppApi.Models;
using NotatAppApi.Repositories.Interfaces;

namespace NotatAppApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController(ITodoRepository TodoRepository, ILogger<TodoController> logger) : ControllerBase
    {
        private readonly ITodoRepository _TodoRepository = TodoRepository;
        private readonly ILogger<TodoController> _logger = logger;

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var Todos = await _TodoRepository.GetAll();
            if (Todos == null)
            {
                _logger.LogError("[TodoController - GetAll] Todo list not found");
                return NotFound("Todos not found");
            }

            return Ok(Todos);
        }

        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var Todo = await _TodoRepository.GetById(id);
            if (Todo == null)
            {
                _logger.LogError("[TodoController - GetById] Todo not found");
                return NotFound("Todo not found");
            }

            return Ok(Todo);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Todo todo)
        {
            if (todo == null)
            {
                _logger.LogError("[TodoController - Create] Todo cannot be null");
                return BadRequest("Todo cannot be null");
            }

            bool returnOk = await _TodoRepository.Create(todo);
            if (returnOk) 
                return CreatedAtAction(nameof(GetAll), todo);

            _logger.LogError("[TodoController - Create] Todo creation failed");
            return StatusCode(500, "Internal server error");
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Todo todo)
        {
            if (todo == null)
            {
                _logger.LogError("[TodoController - Update] Todo cannot be null");
                return BadRequest("Todo cannot be null");
            }

            if (id != todo.TodoId)
            {
                _logger.LogError("[TodoController - Update] Ids must match");
                return BadRequest("Ids must match");
            }

            var existingTodo = await _TodoRepository.GetById(id);
            if (existingTodo == null)
            {
                _logger.LogError("[TodoController - Update] Todo not found");
                return NotFound("Todo not found");
            }

            existingTodo.IsCompleted = todo.IsCompleted;

            bool returnOk = await _TodoRepository.Update(existingTodo);
            if (returnOk) 
                return Ok(existingTodo);

            _logger.LogError("[TodoController - Update] Update failed");
            return StatusCode(500, "Internal server error");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool returnOk = await _TodoRepository.Delete(id);
            if (returnOk)
                return NoContent();

            _logger.LogError("[TodoController - Delete] Deletion failed");
            return BadRequest("Deletion failed");
        }
    }
}