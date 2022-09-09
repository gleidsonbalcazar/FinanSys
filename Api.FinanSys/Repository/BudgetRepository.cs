
using System;
using System.Collections.Generic;
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

        internal void UpdateAllMonth(Budget budget)
        {
            if(budget.Id == null){
                return;
            }

            var actualYear = DateTime.Now.Year;
            int[] monthsYear = new int[]{1,2,3,4,5,6,7,8,9,10,11,12};
            var monthsIncludedThisYear = this._context.Launch.Where(w => w.BudgetId == budget.Id && w.Day.Year == actualYear).Select(s => s.Day.Month);
            var monthsNotIncludedThisYear = monthsYear.Except(monthsIncludedThisYear);

            if(budget.Default.Value){
              AddLaunchesBudgetDefault(budget,monthsNotIncludedThisYear);
            } else {
              RemoveLaunchesNotBudgetDefault(budget, monthsYear);  
            }

             this._context.SaveChanges();
        }

        private void RemoveLaunchesNotBudgetDefault(Budget budget, int[] monthsYear)
        {
            var launchesEmpty = _context.Launch.Where(s => s.BudgetId == budget.Id 
                                                            && s.ValueExec == 0 
                                                            && s.ValuePrev == 0).ToList();
            _context.Launch.RemoveRange(launchesEmpty);
        }

        private void AddLaunchesBudgetDefault(Budget budget, IEnumerable<int> monthsNotIncludedThisYear)
        {
            var actualYear = DateTime.Now.Year;
            foreach (var month in monthsNotIncludedThisYear)
            {
                var launch = new Launch(){
                                            BudgetId = (int)budget.Id, 
                                            Active = true, 
                                            Day = new DateTime(actualYear, month, 1), 
                                            Description = budget.Description, 
                                            TypeLaunch  = budget.TypeBudget,
                                            ValuePrev = budget.Value,
                                            ValueExec = 0.0M,
                                            AccountId = 1
                                        };
                this._context.Launch.Add(launch);
            }
            
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
    }
}