using FinansysControl.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FinansysControl.Models
{
    public class BudgetConfig : IEntity
    {

        public int? Id { get; set; }

        [Required]
        public int BudgetId { get; set; }


        [Required]
        public int Month { get; set; }

        [Required]
        public int Year { get; set; }

        public bool? Active { get; set; }


    }
}
