namespace Api.FinanSys.Repository.RepoResp
{
    public class BudgetRepoResp
    {

        public int BudgetId { get; set; }
        public int BudgetConfigId { get; set; }

        public string BudgetName { get; set; }
        public bool? Active { get; set; }
        public string TypeBudget { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal Value { get; set; }
    }
}
