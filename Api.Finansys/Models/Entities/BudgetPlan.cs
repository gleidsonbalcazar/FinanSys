using FinansysControl.Data;
using System;
using System.ComponentModel.DataAnnotations;

namespace Api.FinanSys.Models.Entities
{
    public class BudgetPlan : IEntity
    {
        public int? Id { get; set; }

        [Required]
        public int BudgetId { get; set; }

        [Required]
        public int Month { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public decimal ValuePrev { get; set; }

        [Required]
        public bool Planned { get; set; }

        public int UserCreated { get; set; }

        public DateTime DateCreated { get; set; }

        public bool? Active { get; set; }
    }
}
