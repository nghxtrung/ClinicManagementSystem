using Domain.Interfaces;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Repositories
{
    public abstract class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        private readonly EFContext _efContext;

        public BaseRepository(EFContext efContext)
        {
            _efContext = efContext;
        }

        public async Task<IQueryable<T>> GetAllAsync()
        {
            return await Task.Run(() => _efContext.Set<T>().AsNoTracking());
        }

        public async Task<IQueryable<T>> GetByConditionAsync(Expression<Func<T, bool>> expression)
        {
            return await Task.Run(() => _efContext.Set<T>().Where(expression).AsNoTracking());
        }

        public async Task InsertAsync(T entity)
        {
            _efContext.Entry(entity).State = EntityState.Added;
            await _efContext.Set<T>().AddAsync(entity);
            await _efContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _efContext.Entry(entity).State = EntityState.Modified;
            await Task.Run(() => _efContext.Set<T>().Update(entity));
            await _efContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            _efContext.Entry(entity).State = EntityState.Deleted;
            await Task.Run(() => _efContext.Set<T>().Remove(entity));
            await _efContext.SaveChangesAsync();
        }
    }
}
