
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Api.FinanSys.Models.Entities;
using Api.FinanSys.Models.Requests;
using FinansysControl.Data;
using Repository.Base;

namespace Repository
{
    public class BudgetRepository : EfCoreGenericRepository<Budget, FinansysContext>
    {
        private readonly FinansysContext _context;
        public BudgetRepository(FinansysContext context) : base(context)
        {
            this._context = context;
        }


        public void UpdateBudget(BudgetRequest budgetReq)
        {
            var budget = this._context.Budget.FirstOrDefault(f => f.Id == budgetReq.Id);

            budget.BudgetConfig.Clear();

            budget.Description = budgetReq.Description;
            budget.TypeBudget = budgetReq.TypeBudget;
            budget.Value = 0;
            budget.Active = budgetReq.Active;
            budget.BudgetConfig = budgetReq.BudgetConfig;

            this._context.SaveChanges();
        }

        public Budget AddBudget(BudgetRequest budgetReq)
        {
            var budget = new Budget()
            {
                Active = true,
                Value = 0,
                BudgetConfig = budgetReq.BudgetConfig,
                Description = budgetReq.Description,
                TypeBudget = budgetReq.TypeBudget,
                DateCreated = budgetReq.DateCreated,
                UserCreated = budgetReq.UserCreated,
            };

            this._context.Budget.Add(budget);

            try
            {
                this._context.SaveChanges();

            } catch (Exception ex)
            {

            }

            return budget;
        }

        public async Task<Budget> DeleteBudget(int id)
        {
            RemoveBudgetConfig(id);
            RemoveBudgetWords(id);

            var entity = await _context.Set<Budget>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            entity.Active = false;

            await _context.SaveChangesAsync();

            return entity;
        }

        private void RemoveBudgetWords(int budgetId)
        {
            try
            {
                var budgetWords = _context.BudgetWords.Where(b => b.BudgetId == budgetId).ToList();
                budgetWords.ForEach(f => f.Active = false);
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public async Task<BudgetConfig> RemoveBudgetConfig(int budgetId)
        {
             
            var entity = await this._context.Set<BudgetConfig>().FindAsync(budgetId);
            if (entity == null)
            {
                return entity;
            }

            this._context.Set<BudgetConfig>().Remove(entity);
            await this._context.SaveChangesAsync();

            return entity;
        }


        public BudgetWords UpdateWord(int budgetWordId, BudgetWords budgetWord)
        {
           var budgetWordResp = this._context.BudgetWords.FirstOrDefault(f => f.Id == budgetWordId);
           budgetWordResp.BudgetWord = budgetWord.BudgetWord;
           
           this._context.SaveChanges();

           return budgetWord;
        }

        public async Task<BudgetWords> DeleteBudgetWords(int id)
        {
            var entity = await this._context.Set<BudgetWords>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            this._context.Set<BudgetWords>().Remove(entity);
            await this._context.SaveChangesAsync();

            return entity;
        }


        public BudgetWords AddNewWord(BudgetWordRequest budget)
        {
            var budgetRepo = this._context.Budget.FirstOrDefault(f => f.Id == budget.BudgetId);
            var newBudgetWord = new BudgetWords();

            if(budget.BudgetWord == null)
            {
                return newBudgetWord;
            }

            if (budgetRepo != null && budgetRepo.BudgetWords.Count(a => a.BudgetWord?.Trim() == budget.BudgetWord?.Trim() && a.BudgetId == budget.BudgetId)==0)
            {
                newBudgetWord.BudgetWord = budget.BudgetWord;
                newBudgetWord.BudgetId = budget.BudgetId;
                newBudgetWord.DateCreated = budget.DateCreated;
                newBudgetWord.UserCreated = budget.UserCreated;

                budgetRepo.BudgetWords.Add(newBudgetWord);

                this._context.SaveChanges();
            }

            return newBudgetWord;
;
        }
    }
}