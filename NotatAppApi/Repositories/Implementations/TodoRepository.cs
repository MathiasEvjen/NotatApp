using Backend.Data;
using Microsoft.EntityFrameworkCore;
using NotatAppApi.Models;
using NotatAppApi.Repositories.Interfaces;

namespace NotatAppApi.Repositories.Implementations
{
    public class TodoRepository(AppDbContext context, ILogger<ITodoRepository> logger) : ITodoRepository
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<ITodoRepository> _logger = logger;

        public async Task<List<Todo>?> GetAll()
        {
            try
            {
                return await _context.Todos.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[TodoRepository] GetAll failed, exception: {e}", e.Message);
                return null;
            }
        }

        public async Task<Todo?> GetById(int id)
        {
            try
            {
                return await _context.Todos.FindAsync(id);
            }
            catch (Exception e)
            {
                _logger.LogError("[TodoRepository] GetById failed, exception: {e}", e.Message);
                return null;
            }
        }

        public async Task<bool> Create(Todo todo)
        {
            try
            {
                _context.Todos.Add(todo);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[TodoRepository] Create failed, exception: {e}", e.Message);
                return false;
            }
        }

        public async Task<bool> Update(Todo todo)
        {
            try
            {
                _context.Todos.Update(todo);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[TodoRepository] Update failed, exception: {e}", e.Message);
                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var todo = await _context.Todos.FindAsync(id);
                if (todo == null) 
                    return false;

                _context.Todos.Remove(todo);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[TodoRepository] Deletion failed, exception: {e}", e.Message);
                return false;
            }
        }
    }
}