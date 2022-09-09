
namespace FinansysControl.Models
{
    public class Home 
    {

        public int Id { get; set; }
        public string Description { get; set; }

        public decimal ValuePrev {get;set;}

        public decimal ValueExec { get; set; }

        public decimal ValueOrc { get; set; }

        public string TypeBudget { get; set; }

    }
}
