

using System;
using System.Collections.Generic;
using System.Linq;
using FinansysControl.Data;
using FinansysControl.Models;
using FinansysControl.Models.ViewModels;

namespace Repository
{
    public class IndicatorsRepository
    {
        private readonly FinansysContext _context;
        public IndicatorsRepository(FinansysContext context)
        {
            _context = context;
        }

        public List<BudgetMonthIndicatorExecuted> GetLineBudgetIndicators(int budgetId)
        {
            var list = new List<BudgetMonthIndicatorExecuted>();
            var yearToday = DateTime.Now.Year;
            var launchsExecuted = _context.Launch.Where(w => w.Day.Year == yearToday && w.ValueExec > 0 && w.BudgetId == budgetId)
                                         .OrderBy(o => o.Day.Month)
                                         .GroupBy(g => new { g.Day.Month })
                                         .Select(grp => new MonthValue() { Month = grp.Key.Month, Value = grp.Sum(s => s.ValueExec) })
                                         .ToList();

            var budgetsExecuted = new BudgetMonthIndicatorExecuted() { 
                                                                        Label = "Executado", 
                                                                        Data = GetMonthValue(launchsExecuted), 
                                                                        AverageValue = launchsExecuted.OrderByDescending(a => a.Month).Take(3).Average(s => s.Value)
            };
            list.Add(budgetsExecuted);


            var budgetsValue = _context.Budget.Where(w => w.Id == budgetId).FirstOrDefault().Value;
            List<MonthValue> budgetsArrayValue = new List<MonthValue>();
            for (int i = 1; i <= 12; i++)
            {
                budgetsArrayValue.Add(new MonthValue() { Month = i, MonthDesc = ResumeMonth(i), Value = budgetsValue });
            }

            var budgetsIndicator = new BudgetMonthIndicatorExecuted() { 
                                                                            Label = "Orçamento", 
                                                                            Data = budgetsArrayValue, 
                                                                            AverageValue = budgetsArrayValue.Average(s => s.Value)
                                                                      };
            list.Add(budgetsIndicator);

            return list;
        }

        private List<MonthValue> GetMonthValue(List<MonthValue> launchsExecuted)
        {
            var list = new List<MonthValue>();
            for (int i = 1; i <= 12; i++)
            {
                var launchsValue = launchsExecuted.FirstOrDefault(f => f.Month == i);
                list.Add(new MonthValue() { Month = i, MonthDesc = ResumeMonth(i), Value = launchsValue != null ? launchsValue.Value : 0.0M});
            }

            return list;
        }

        private static string ResumeMonth(int key)
        {
            switch (key)
            {
                case 1: return "Janeiro";
                case 2: return "Feveiro";
                case 3: return "Março";
                case 4: return "Abril";
                case 5: return "Maio";
                case 6: return "Junho";
                case 7: return "Julho";
                case 8: return "Agosto";
                case 9: return "Setembro";
                case 10: return "Outubro";
                case 11: return "Novembro";
                case 12: return "Dezembro";
                default:
                    return "";
            }
        }
    }
}
