namespace Api.FinanSys.Models.Presentations
{
    public class HomePresentation
    {

        public int Id { get; set; }
        public string Description { get; set; }

        public decimal ValuePrev { get; set; }

        public decimal ValueExec { get; set; }

        public decimal ValueOrc { get; set; }

        public string TypeBudget { get; set; }

        public bool Planned { get; set; }

    }
}
