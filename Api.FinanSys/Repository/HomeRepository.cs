

using System.Collections.Generic;
using System.Linq;
using FinansysControl.Data;
using FinansysControl.Helpers.Enum;
using FinansysControl.Models;
using FinansysControl.Models.ViewModels;

namespace Repository
{
    public class HomeRepository
    {
        private readonly FinansysContext _context;
        public HomeRepository(FinansysContext context)
        {
            _context = context;
        }

        public List<Home> GetPainel(int month, int year)
        {
            var budgets = _context.Budget.Where(w => w.Month == month || w.Month == 0).ToList();
            var Launch = _context.Launch
                                        .Where(w => w.Day.Month == month && w.AccountId != (int)AccountEnum.Poupança)
                                        .Where(y => y.Day.Year == year)
                                        .ToList();

            var home = budgets.Select(s => new Home
            {
                Id = (int)s.Id,
                Description = s.Description,
                TypeBudget = s.TypeBudget,
                ValueOrc = s.Value,
                ValuePrev = 0,
                ValueExec = 0,
            }).ToList();

            home.ForEach(f => f.ValuePrev = Launch.Where(w => w.BudgetId == f.Id).Sum(s => s.ValuePrev));
            home.ForEach(f => f.ValueExec = Launch.Where(w => w.BudgetId == f.Id).Sum(s => s.ValueExec));

            return home.ToList();
        }

        public HomeResume GetPainelResume(int month, int year)
        {

            var budgets = getBudgetsByMonth(month);
            var launchs = getLaunchsByPeriod(month,year);

            var inBoundsExecuted = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Receita.ToDescriptionString() 
                                                    && w.AccountId != (int)AccountEnum.Poupança)
                                           .Where(y => y.Day.Year == year)
                                            .Sum(s => s.ValueExec);

            var inBoundsExpected = budgets.Where(w => w.TypeBudget == TypeLaunchEnum.Receita.ToDescriptionString())
                                            .Sum(s => s.Value);


            var outBoundExecuted = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Despesa.ToDescriptionString() 
                                                    && w.AccountId != (int)AccountEnum.Poupança
                                                )
                                            .Sum(s => s.ValueExec);
            var totalExpensesPlanned = budgets.Where(w => w.TypeBudget == TypeLaunchEnum.Despesa.ToDescriptionString())
                                                .Sum(s => s.Value);

            var totalExpensesByBudgetLaunched = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Despesa.ToDescriptionString() 
                                                                && w.AccountId != (int)AccountEnum.Poupança
                                                             )
                                                        .GroupBy(x => x.BudgetId)
                                                        .Select(y => new ExpensesByBudgetView
                                                                        { 
                                                                            Id = y.Key, 
                                                                            ValueExec = y.Sum(y2 => y2.ValueExec),
                                                                            ValuePrev = y.Sum(y2 => y2.ValuePrev),
                                                                            ValueOrc = budgets.Any(w => w.Id == y.Key) ? budgets.FirstOrDefault(w => w.Id == y.Key).Value : 0
                                                                        });;

            var savedMoney = getSavedMoney();

            var totalExpensesNotPlanned = getTotalExpensesnotPlanned(totalExpensesByBudgetLaunched); 

            var result = new HomeResume
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


        private decimal getTotalExpensesnotPlanned(IEnumerable<ExpensesByBudgetView> totalExpensesByBudgetLaunched)
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

        private decimal getSavedMoney()
        {
            var launchs = _context.Launch.Where(w => w.AccountId == (int)AccountEnum.Poupança && w.ValueExec > 0);

            var launchsExpenses = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Despesa.ToDescriptionString()).Sum(s => s.ValueExec);
            var launchsReceived = launchs.Where(w => w.TypeLaunch == TypeLaunchEnum.Receita.ToDescriptionString()).Sum(s => s.ValueExec);

            return launchsReceived - launchsExpenses;
        }

        private List<Launch> getLaunchsByPeriod(int month, int year)
        {
            return _context.Launch
                                .Where(w => w.Day.Month == month && w.AccountId != (int)AccountEnum.Poupança)
                                .Where(y => y.Day.Year == year)
                                .ToList();
        }

        private List<Budget> getBudgetsByMonth(int month)
        {
            return _context.Budget.Where(w => w.Month == month || w.Month == 0).ToList();
        }
    }
}
