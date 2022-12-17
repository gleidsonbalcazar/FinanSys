using System;
using FinansysControl.Data;

namespace FinansysControl.Models
{
    public class Prediction : IEntity
    {
        public int? Id { get; set; }

        public string Description { get; set; }

        public string BudgetDescription { get; set; }

        public decimal Value { get; set; }

        public DateTime Date { get; set; }
    }
}