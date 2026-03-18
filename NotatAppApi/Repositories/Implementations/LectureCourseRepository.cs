using Backend.Data;
using Microsoft.EntityFrameworkCore;
using NotatAppApi.Models;
using NotatAppApi.Repositories.Interfaces;

namespace NotatAppApi.Repositories.Implementations
{
    public class LectureCourseRepository(AppDbContext context, ILogger<ILectureCourseRepository> logger) : ILectureCourseRepository
    {
        private readonly AppDbContext _context = context;
        private readonly ILogger<ILectureCourseRepository> _logger = logger;

        public async Task<List<LectureCourse>?> GetAll()
        {
            try
            {
                return await _context.LectureCourses.Include(lc => lc.Sheets).ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[LectureCourseRepository] GetAll failed, exception: {e}", e.Message);
                return null;
            }
        }

        public async Task<LectureCourse?> GetById(int id)
        {
            try
            {
                return await _context.LectureCourses.FindAsync(id);
            }
            catch (Exception e)
            {
                _logger.LogError("[LectureCourseRepository] GetById failed, exception: {e}", e.Message);
                return null;
            }
        }

        public async Task<bool> Create(LectureCourse course)
        {
            try
            {
                _context.LectureCourses.Add(course);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[LectureCourseRepository] Create failed, exception: {e}", e.Message);
                return false;
            }
        }

        public async Task<bool> Update(LectureCourse course)
        {
            try
            {
                _context.LectureCourses.Update(course);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[LectureCourseRepository] Update failed, exception: {e}", e.Message);
                return false;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var course = await _context.LectureCourses.FindAsync(id);
                if (course == null) 
                    return false;

                _context.LectureCourses.Remove(course);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[LectureCourseRepository] Deletion failed, exception: {e}", e.Message);
                return false;
            }
        }
    }
}