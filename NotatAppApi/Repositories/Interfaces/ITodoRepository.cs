using NotatAppApi.Models;

namespace NotatAppApi.Repositories.Interfaces
{
    public interface ITodoRepository
    {
        Task<List<Todo>?> GetAll();
        Task<Todo?> GetById(int id);
        Task<bool> Create(Todo todo);
        Task<bool> Update(Todo todo);
        Task<bool> Delete(int id);
    }
}