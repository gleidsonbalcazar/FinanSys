using System;

namespace Api.FinanSys.Models.Requests
{
    public class BudgetWordRequest
    {
        public int BudgetId { get; set; }

        public string BudgetWord { get; set; }

        public string UserCreated { get; set; }

        public DateTime? DateCreated { get; set; }
    }
}
