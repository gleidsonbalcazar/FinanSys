

using System;
using System.Collections.Generic;
using System.Linq;
using Api.FinanSys.Models.Entities;
using Api.FinanSys.Models.Presentations;
using Api.FinanSys.Repository.RepoResp;
using FinansysControl.Data;
using FinansysControl.Helpers.Enum;

namespace Repository
{
    public class HomeRepository
    {
        private readonly FinansysContext _context;
        public HomeRepository(FinansysContext context)
        {
            _context = context;
        }

        public List<HomePresentation> GetPainel(int month, int year)
        {
            List<BudgetRepoResp> budgetRepoResp = GetInfoBudgetByFilters(month, year);
   
            var Launch = _context.Launch
                                        .Where(w => w.Day.Month == month && w.AccountId != (int)AccountEnum.Poupança)
                                        .Where(y => y.Day.Year == year)
                                        .ToList();

            var home = budgetRepoResp.Select(s => new HomePresentation
            {
                Id = (int)s.BudgetId,
                Description = s.BudgetName,
                TypeBudget = s.TypeBudget,
                ValueOrc = s.Value,
                ValuePrev = 0,
                ValueExec = 0,
                Planned = true
            }).ToList();

            var budgetsConfigIdList = budgetRepoResp.Select(s => s.BudgetId);
            var budgetsNotPlanned = Launch.Where(s => !budgetsConfigIdList.Contains(s.BudgetId)).Select(s => s.Budget).ToList();

            home.AddRange(
                budgetsNotPlanned
                    .GroupBy(g => new { g.Id, g.TypeBudget, g.Description, g.Value })
                    .Select(s => new HomePresentation 
                                                {
                                                    Id = (int)s.Key.Id,
                                                    Description = s.Key.Description,
                                                    TypeBudget = s.Key.TypeBudget,
                                                    ValueOrc = s.Key.Value,
                                                    ValuePrev = 0,
                                                    ValueExec = 0,
                                                    Planned = false
                }
                                        )
                );

            home.ForEach(f => f.ValuePrev = Launch.Where(w => w.BudgetId == f.Id).Sum(s => s.ValuePrev));
            home.ForEach(f => f.ValueExec = Launch.Where(w => w.BudgetId == f.Id).Sum(s => s.ValueExec));

            return home.OrderBy(o => o.Description).ToList();
        }

        private List<BudgetRepoResp> GetInfoBudgetByFilters(int month, int year)
        {
            return (from b in _context.Budget
                    join bc in _context.BudgetConfig on b.Id equals bc.BudgetId
                    where (bc.Month == month || bc.Month == 0) && (bc.Year == year)
                    select new BudgetRepoResp
                    {
                        BudgetId = bc.BudgetId,
                        Month = bc.Month,
                        BudgetName = b.Description,
                        Year = bc.Year,
                        Value = bc.Value,
                        Active = bc.Active,
                        BudgetConfigId = bc.Id ?? 0,
                        TypeBudget = b.TypeBudget
                    })
                    .ToList();
        }

        public HomeResumePresentation GetPainelResume(int month, int year)
        {

            List<BudgetRepoResp> budgetRepoResp = GetInfoBudgetByFilters(month, year);
            var launchs = GetLaunchsByPeriod(month,year);

            var inBoundsExecuted = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Receita.ToDescriptionString() 
                                                    && w.AccountId != (int)AccountEnum.Poupança)
                                           .Where(y => y.Day.Year == year)
                                            .Sum(s => s.ValueExec);

            var inBoundsExpected = budgetRepoResp.Where(w => w.TypeBudget == TypeLaunchEnum.Receita.ToDescriptionString())
                                            .Sum(s => s.Value);


            var outBoundExecuted = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Despesa.ToDescriptionString() 
                                                    && w.AccountId != (int)AccountEnum.Poupança
                                                )
                                            .Sum(s => s.ValueExec);
            var totalExpensesPlanned = budgetRepoResp.Where(w => w.TypeBudget == TypeLaunchEnum.Despesa.ToDescriptionString())
                                                .Sum(s => s.Value);

            var totalExpensesByBudgetLaunched = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Despesa.ToDescriptionString() 
                                                                && w.AccountId != (int)AccountEnum.Poupança
                                                             )
                                                        .GroupBy(x => x.BudgetId)
                                                        .Select(y => new ExpensesByBudgetPresentation
                                                                        { 
                                                                            Id = y.Key, 
                                                                            ValueExec = y.Sum(y2 => y2.ValueExec),
                                                                            ValuePrev = y.Sum(y2 => y2.ValuePrev),
                                                                            ValueOrc = budgetRepoResp.Any(w => w.BudgetId == y.Key) ? budgetRepoResp.FirstOrDefault(w => w.BudgetId == y.Key).Value : 0
                                                                        });;

            var savedMoney = GetSavedMoney();

            var totalExpensesNotPlanned = GetTotalExpensesnotPlanned(totalExpensesByBudgetLaunched); 

            var result = new HomeResumePresentation
            {
                InBoundsExecuted = inBoundsExecuted,
                InBoundsExpected = (inBoundsExpected - inBoundsExecuted) < 0 ? 0:(inBoundsExpected - inBoundsExecuted),
                OutBoundExecuted = outBoundExecuted,
                TotalExpensesPlanned = totalExpensesPlanned,
                TotalExpensesNotPlanned = totalExpensesNotPlanned,
                ActualBalance = inBoundsExecuted - outBoundExecuted,
                TotalExpenses = totalExpensesPlanned + totalExpensesNotPlanned,
                SavedMoney = savedMoney,
                OutBoundExpected =  (totalExpensesPlanned + totalExpensesNotPlanned) - outBoundExecuted,
            };

            return result;
        }


        private decimal GetTotalExpensesnotPlanned(IEnumerable<ExpensesByBudgetPresentation> totalExpensesByBudgetLaunched)
        {
            var totalExpensesNotPlanned = 0.0M;
            foreach (var itemEx in totalExpensesByBudgetLaunched)
            {
                if (itemEx.ValueExec + itemEx.ValuePrev > itemEx.ValueOrc)
                {
                    totalExpensesNotPlanned = totalExpensesNotPlanned + ((itemEx.ValueExec + itemEx.ValuePrev) - itemEx.ValueOrc);
                }
            }
            return totalExpensesNotPlanned;
        }

        private decimal GetSavedMoney()
        {
            var launchs = _context.Launch.Where(w => w.AccountId == (int)AccountEnum.Poupança && w.ValueExec > 0);

            var launchsExpenses = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Despesa.ToDescriptionString()).Sum(s => s.ValueExec);
            var launchsReceived = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Receita.ToDescriptionString()).Sum(s => s.ValueExec);

            return launchsReceived - launchsExpenses;
        }

        private List<Launch> GetLaunchsByPeriod(int month, int year)
        {
            return _context.Launch
                                .Where(w => w.Day.Month == month && w.AccountId != (int)AccountEnum.Poupança)
                                .Where(y => y.Day.Year == year)
                                .ToList();
        }

        //private List<BudgetConfig> GetBudgetsByMonth(int month, int year)
        //{
        //    var budgetConfig = _context.BudgetConfig.Where(w => (w.Month == month || w.Month == 0) && (w.Year == year)).ToList();

        //    return budgetConfig;
        //}
    }
}
