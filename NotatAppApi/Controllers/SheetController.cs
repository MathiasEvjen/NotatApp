using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using NotatAppApi.Models;
using NotatAppApi.Repositories.Interfaces;

namespace NotatAppApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SheetController(ISheetRepository sheetRepository, ILogger<SheetController> logger) : ControllerBase
    {
        private readonly ISheetRepository _sheetRepository = sheetRepository;
        private readonly ILogger<SheetController> _logger = logger;

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var sheets = await _sheetRepository.GetAll();
            if (sheets == null)
            {
                _logger.LogError("[SheetController - GetAll] Sheet list not found");
                return NotFound("Sheets not found");
            }

            return Ok(sheets);
        }

        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var sheet = await _sheetRepository.GetById(id);
            if (sheet == null)
            {
                _logger.LogError("[SheetController - GetById] Sheet not found");
                return NotFound("Sheet not found");
            }

            return Ok(sheet);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Sheet sheet)
        {
            if (sheet == null)
            {
                _logger.LogError("[SheetController - Create] Sheet cannot be null");
                return BadRequest("Sheet cannot be null");
            }

            bool returnOk = await _sheetRepository.Create(sheet);
            if (returnOk) 
                return CreatedAtAction(nameof(GetAll), sheet);

            _logger.LogError("[SheetController - Create] Sheet creation failed");
            return StatusCode(500, "Internal server error");
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Sheet sheet)
        {
            if (sheet == null)
            {
                _logger.LogError("[SheetController - Update] Sheet cannot be null");
                return BadRequest("Sheet cannot be null");
            }

            if (id != sheet.SheetId)
            {
                _logger.LogError("[SheetController - Update] Ids must match");
                return BadRequest("Ids must match");
            }

            var existingSheet = await _sheetRepository.GetById(id);
            if (existingSheet == null)
            {
                _logger.LogError("[SheetController - Update] Sheet not found");
                return NotFound("Sheet not found");
            }

            existingSheet.Title = sheet.Title;
            existingSheet.Content = sheet.Content;

            bool returnOk = await _sheetRepository.Update(existingSheet);
            if (returnOk) 
                return Ok(existingSheet);

            _logger.LogError("[SheetController - Update] Update failed");
            return StatusCode(500, "Internal server error");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool returnOk = await _sheetRepository.Delete(id);
            if (returnOk)
                return NoContent();

            _logger.LogError("[SheetController - Delete] Deletion failed");
            return BadRequest("Deletion failed");
        }
    }
}