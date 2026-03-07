using NotatAppApi.Models;

namespace NotatAppApi.Repositories.Interfaces
{
    public interface ILectureCourseRepository
    {
        public Task<List<LectureCourse>?> GetAll();
        public Task<LectureCourse?> GetById(int id);
        public Task<bool> Create(LectureCourse lectureCourse);
        public Task<bool> Update(LectureCourse lectureCourse);
        public Task<bool> Delete(int id);
    }
}