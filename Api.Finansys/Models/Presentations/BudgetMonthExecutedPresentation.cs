using System.Collections.Generic;

namespace Api.FinanSys.Models.Presentations
{
    public class BudgetMonthExecutedPresentation
    {
        public string Label { get; set; }
        public List<MonthValue> Data { get; set; }

        public decimal AverageValue { get; set; }
    }

    public class MonthValue
    {
        public int Month { get; set; }

        public string MonthDesc { get; set; }

        public decimal Value { get; set; }
    }

}
