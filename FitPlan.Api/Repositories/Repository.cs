using Microsoft.EntityFrameworkCore;
using FitPlan.Api.Models;
using FitPlan.Api.Data;

namespace FitPlan.Api.Repositories;

/*
CLASS NAME: Repository

DESCRIPTION: 
    Represents a generic repository for CRUD operations on entities. 
    It implements the IRepository interface and provides methods for retrieving, adding, updating, and deleting entities from the database.
*/

public class Repository<T>(AppDbContext context) : IRepository<T> where T : class, IBaseEntity
{
    private readonly AppDbContext _context = context;

    private readonly DbSet<T> _dbSet = context.Set<T>(); // Deduces the table based on the input type

    public async Task<IEnumerable<T>> GetAllAsync() => 
        await _dbSet.ToListAsync();

    public async Task<T?> GetByIdAsync(int id) => 
        await _dbSet.FindAsync(id);

    public async Task AddAsync(T entity) => 
        await _dbSet.AddAsync(entity);

    public void Update(T entity) => 
        _dbSet.Update(entity);

    public void Delete(T entity) => 
        _dbSet.Remove(entity);

    public async Task<bool> SaveChangesAsync() => 
        await _context.SaveChangesAsync() > 0;
}