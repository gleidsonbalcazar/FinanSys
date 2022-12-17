using FinansysControl.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Repository.Base
{
    public abstract class EfCoreGenericRepository<TEntity, TContext> : IRepository<TEntity>
        where TEntity : class, IEntity
        where TContext : DbContext
    {
        private readonly TContext context;
        public EfCoreGenericRepository(TContext context)
        {
            this.context = context;
        }
        public async Task<TEntity> Add(TEntity entity)
        {
            context.Set<TEntity>().Add(entity);
            await context.SaveChangesAsync();
            return entity;
        }

        public async Task<TEntity> Delete(int id)
        {
            var entity = await context.Set<TEntity>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            context.Set<TEntity>().Remove(entity);
            await context.SaveChangesAsync();

            return entity;
        }

        public async Task<TEntity> Get(int id)
        {
            return await context.Set<TEntity>().FindAsync(id);
        }

        public async Task<List<TEntity>> GetAll()
        {
            return await context.Set<TEntity>().ToListAsync();
        }

 

        public async Task<List<TEntity>> GetAllFilter(
                                                        Expression<Func<TEntity, bool>> predicate,
                                                        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                                        params Expression<Func<TEntity, object>>[] includeProperties)
        {
            var query = context.Set<TEntity>().AsQueryable();

            if (predicate != null)
            {
                query = query.Where(predicate).AsQueryable();
            }

            if (includeProperties != null)
            {
                query = this.ApplyIncludesOnQuery(query, includeProperties);
            }

            if (orderBy != null)
            {
                return (orderBy(query).ToList());
            }
           
            return (query.ToList());
        }

        public IQueryable<TEntity> ApplyIncludesOnQuery<TEntity>(IQueryable<TEntity> query, params Expression<Func<TEntity, object>>[] includeProperties) where TEntity : class, IEntity
        {
            // Return Applied Includes query
            return (includeProperties.Aggregate(query, (current, include) => current.Include(include)));
        }

        public async Task<TEntity> Update(TEntity entity)
        {
            context.Entry(entity).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return entity;
        }

    }
}