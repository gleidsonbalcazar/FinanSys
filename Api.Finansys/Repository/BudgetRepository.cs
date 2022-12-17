
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Api.FinanSys.Models.ViewModels;
using FinansysControl.Data;
using FinansysControl.Models;
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

        public void UpdateConfig(int? budgetId, BudgetReq budgetReq)
        {
            if (budgetId == null)
            {
                return;
            }

            budgetReq.Id = budgetId;
            var monthsIncludedThisYear = this._context.BudgetConfig.Where(w => w.BudgetId == budgetId && w.Year == DateTime.Now.Year).Select(s => s.Month);

            if (monthsIncludedThisYear.Count() > 0)
            {
                RemoveBudgetConfig(budgetId??0);
            }

            AddBudgetConfig(budgetReq, budgetReq.BudgetConfig.Select(s => s.Month));
  
            this._context.SaveChanges();

        }

        private void AddBudgetConfig(BudgetReq budget, IEnumerable<int> monthsNotIncludedThisYear)
        {
            foreach (var month in monthsNotIncludedThisYear)
            {
                var budgetConfig = new BudgetConfig()
                {
                    Active = true,
                    BudgetId = (int)budget.Id,
                    Month = month,
                    Year = DateTime.Now.Year
                };

                this._context.BudgetConfig.Add(budgetConfig);
            }

        }

        public void UpdateBudget(BudgetReq budgetReq)
        {
            var budget = this._context.Budget.FirstOrDefault(f => f.Id == budgetReq.Id);
            budget.Description = budgetReq.Description;
            budget.TypeBudget = budgetReq.TypeBudget;
            budget.Value = budgetReq.Value;
            budget.Active = budgetReq.Active;
            budget.UserCreated = "Web";

            this._context.SaveChanges();
        }

        public Budget AddBudget(BudgetReq budgetReq)
        {
            var budget = new Budget()
            {
                Active = true,
                DateCreated = DateTime.Now,
                UserCreated = "Web",
                Value = budgetReq.Value,
                Description = budgetReq.Description,
                TypeBudget = budgetReq.TypeBudget,
            };

            this._context.Budget.Add(budget);

            this._context.SaveChanges();

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

        private void RemoveBudgetConfig(int budgetId)
        {
            try
            {
                var budgetConfig = _context.BudgetConfig.Where(b => b.BudgetId == budgetId).ToList();
                this._context.BudgetConfig.RemoveRange(budgetConfig);
            }
            catch (Exception ex )
            {

                throw ex;
            }
           
        }


        //private void RemoveLaunchesNotBudgetDefault(Budget budget, int[] monthsYear)
        //{
        //    var launchesEmpty = _context.Launch.Where(s => s.BudgetId == budget.Id 
        //                                                    && s.ValueExec == 0 
        //                                                    && s.ValuePrev == 0).ToList();
        //    _context.Launch.RemoveRange(launchesEmpty);
        //}

        //private void AddLaunchesBudgetDefault(Budget budget, IEnumerable<int> monthsNotIncludedThisYear)
        //{
        //    var actualYear = DateTime.Now.Year;
        //    foreach (var month in monthsNotIncludedThisYear)
        //    {
        //        var launch = new Launch(){
        //                                    BudgetId = (int)budget.Id, 
        //                                    Active = true, 
        //                                    Day = new DateTime(actualYear, month, 1), 
        //                                    Description = budget.Description, 
        //                                    TypeLaunch  = budget.TypeBudget,
        //                                    ValuePrev = budget.Value,
        //                                    ValueExec = 0.0M,
        //                                    AccountId = 1
        //                                };
        //        this._context.Launch.Add(launch);
        //    }

        //}

        #region Budget Words

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


        public BudgetWords AddNewWord(BudgetWordReq budget)
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
                newBudgetWord.DateCreated = DateTime.Now;
                newBudgetWord.UserCreated = "admin";

                budgetRepo.BudgetWords.Add(newBudgetWord);

                this._context.SaveChanges();
            }

            return newBudgetWord;
;
        }

        #endregion
    }
}