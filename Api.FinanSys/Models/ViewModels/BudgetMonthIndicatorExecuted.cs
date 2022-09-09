﻿using System.Collections.Generic;

namespace FinansysControl.Models.ViewModels
{
    public class BudgetMonthIndicatorExecuted 
    {
        public string Label { get; set; }
        public List<MonthValue> Data { get; set; }

        public decimal AverageValue {get;set;}
    }

    public class MonthValue
    {
        public int Month { get; set; }

        public string MonthDesc { get; set; }

        public decimal Value { get; set; }
    }

}
