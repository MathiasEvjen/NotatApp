using Backend.Data;
using Microsoft.EntityFrameworkCore;
using NotatAppApi.Models;
using NotatAppApi.Repositories.Interfaces;

namespace NotatAppApi.Repositories.Implementations
{
    public class SheetRepository(AppDbContext context, ILogger<ISheetRepository> logger) : ISheetRepository
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger _logger = logger;

        public async Task<List<Sheet>?> GetAll()
        {
            try
            {
                return await _context.Sheets.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[SheetRepository] GetAll failed, exception: {e}", e.Message);
                return null;
            }
        }

        public async Task<Sheet?> GetById(int id)
        {
            try
            {
                return await _context.Sheets.FindAsync(id);
            }
            catch (Exception e)
            {
                _logger.LogError("[SheetRepository] GetById failed, exception: {e}", e.Message);
                return null;
            }
        }

        public async Task<bool> Create(Sheet sheet)
        {
            try
            {
                _context.Sheets.Add(sheet);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[SheetRepository] Create failed, exception: {e}", e.Message);
                return false;
            }
        }

        public async Task<bool> Update(Sheet sheet)
        {
            try
            {
                _context.Sheets.Update(sheet);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[SheetRepository] Update failed, exception: {e}", e.Message);
                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var sheet = await _context.Sheets.FindAsync(id);
                if (sheet == null) 
                    return false;

                _context.Sheets.Remove(sheet);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[SheetRepository] Deletion failed, exception: {e}", e.Message);
                return false;
            }
        }
    }
}