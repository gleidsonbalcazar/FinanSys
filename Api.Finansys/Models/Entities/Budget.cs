using FinansysControl.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Api.FinanSys.Models.Entities
{
    public class Budget : IEntity
    {

        public int? Id { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public decimal Value { get; set; }

        public bool? Active { get; set; }

        public bool? Default { get; set; }

        [Required]
        public string TypeBudget { get; set; }

        public string UserCreated { get; set; }
        public DateTime? DateCreated { get; set; }

        public virtual List<BudgetWords> BudgetWords { get; set; }

        public virtual List<BudgetConfig> BudgetConfig { get; set; }
    }
}
