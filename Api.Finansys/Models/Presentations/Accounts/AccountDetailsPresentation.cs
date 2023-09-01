using System;

namespace Api.FinanSys.Models.Presentations.Accounts
{
    public class AccountDetailsPresentation
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public decimal Value { get; set; }
        public DateTime? LastUpdate { get; set; }
    }
}
