using System.Linq.Expressions;

namespace Domain.Interfaces
{
    public interface IBaseRepository<T>
    {
        Task<IQueryable<T>> GetAllAsync();
        Task<IQueryable<T>> GetByConditionAsync(Expression<Func<T, bool>> expression);
        Task InsertAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
    }
}
