using FinansysControl.Data;
using System.ComponentModel.DataAnnotations;

namespace Api.FinanSys.Models.Entities
{
    public class BudgetConfig : IEntity
    {
        public int? Id { get; set; }

        [Required]
        public int BudgetId { get; set; }


        [Required]
        public int Month { get; set; }

        [Required]
        public decimal Value { get; set; }

        [Required]
        public int Year { get; set; }

        public bool? Active { get; set; }

    }
}
