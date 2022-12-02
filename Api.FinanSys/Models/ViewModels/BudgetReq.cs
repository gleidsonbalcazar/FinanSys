using FinansysControl.Models;
using System;
using System.Collections.Generic;

namespace Api.FinanSys.Models.ViewModels
{
    public class BudgetReq
    {
        public int? Id { get; set; }

        public string Description { get; set; }

        public decimal Value { get; set; }

        public string TypeBudget { get; set; }

        public List<BudgetConfig> BudgetConfig { get; set; }

        public bool? Active { get; set; }

    }
}
