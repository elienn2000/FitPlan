namespace FitPlan.Api.Repositories;

using FitPlan.Api.Models;

/*
INTERFACE NAME: IRepository
DESCRIPTION: Represents a generic repository interface for CRUD operations on entities.
*/

public interface IRepository<T> where T : class, IBaseEntity
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task<bool> SaveChangesAsync();
}