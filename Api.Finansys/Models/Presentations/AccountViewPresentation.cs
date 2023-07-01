using System;

namespace Api.FinanSys.Models.Presentations
{
    public class AccountViewPresentation
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public decimal Value { get; set; }
        public DateTime? LastUpdate { get; set; }
    }
}
