using FinansysControl.Data;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace FinansysControl.Models
{
    public class Launch : IEntity
    {

        public int? Id { get; set; }

        [Required]
        public string  Description { get; set; }

        [Required]
        public int BudgetId {get;set;}

        [Required]
        public int AccountId {get;set;}

        [Required]
        public DateTime Day { get; set; }

        [Required]
        [DefaultValue(0)]
        public decimal ValuePrev { get; set; }

        [Required]
        [DefaultValue(0)]
        public decimal ValueExec { get; set; }
        [Required]
        public string TypeLaunch { get; set; }
        
        public bool? Active { get; set; }

        public string UserCreated { get; set; }

        public DateTime? DateCreated { get; set;}

        public virtual Budget Budget { get; set; }

        public virtual Account Account { get; set; }

    }
}
