using Api.FinanSys.Models.Entities;
using System;
using System.Collections.Generic;

namespace Api.FinanSys.Models.Requests
{
    public class BudgetRequest
    {
        public int? Id { get; set; }

        public string Description { get; set; }

        public string TypeBudget { get; set; }

        public List<BudgetConfig> BudgetConfig { get; set; }

        public bool? Active { get; set; }

        public string userCreated { get; set; }

        public DateTime? dateCreated { get; set; }

    }
}
