
using System;

namespace FinansysControl.Models
{
    public class ImportData
    {

        public int Id { get; set; }
        public int AccountId { get; set; }
        public DateTime DateLaunch { get; set; }
        public string Description { get; set; }
        public decimal ValueLaunch { get; set; }
        public string TypeLaunch { get; set; }

        public int? ProspectiveBudgetId { get; set; }
        public bool ProspectiveLoaded { get; set; }
        public int SelectedBudgetId { get; set; }

        public DateTime DateCreated { get; set; }

        public string UserCreated { get; set; }

    }
}
