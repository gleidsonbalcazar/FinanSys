using System;
using System.ComponentModel.DataAnnotations;
using FinansysControl.Data;

namespace Api.FinanSys.Models.Entities
{
    public class BudgetWords : IEntity
    {

        public int? Id { get; set; }

        [Required]
        public int BudgetId { get; set; }

        [Required]
        protected string _BudgetName;

        [Required]
        public bool Active { get; set; }


        public string BudgetWord { get { return _BudgetName; } set { _BudgetName = value == null ? value : value.Trim(); } }

        public string UserCreated { get; set; }
        public DateTime? DateCreated { get; set; }
    }

}