namespace Api.FinanSys.Models.Presentations
{
    public class ExpensesByBudgetPresentation
    {
        public int Id { get; set; }

        public decimal ValueExec { get; set; }

        public decimal ValuePrev { get; set; }

        public decimal ValueOrc { get; set; }

    }
}
