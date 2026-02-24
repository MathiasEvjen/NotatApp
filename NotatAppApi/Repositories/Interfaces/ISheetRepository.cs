using NotatAppApi.Models;

namespace NotatAppApi.Repositories.Interfaces
{
    public interface ISheetRepository {
        Task<List<Sheet>?> GetAll();
        Task<Sheet?> GetById(int id);
        Task<bool> Create(Sheet sheet);
        Task<bool> Update(Sheet sheet);
        Task<bool> Delete(int id);
    }
}