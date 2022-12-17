using System;

namespace Api.FinanSys.Models.ViewModels
{
    public class AccountViewModel
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public decimal Value { get; set; }

        public DateTime? LastUpdate { get; set; }
    }
}
