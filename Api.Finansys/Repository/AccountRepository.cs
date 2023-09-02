using Api.FinanSys.Models.Entities;
using Api.FinanSys.Models.Presentations.Accounts;
using FinansysControl.Data;
using FinansysControl.Helpers.Enum;
using FinansysControl.Models.Auth;
using Repository.Base;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class AccountRepository : EfCoreGenericRepository<Account, FinansysContext>
    {
        private readonly FinansysContext context;
        public AccountRepository(FinansysContext context) : base(context)
        {
            this.context = context;
        }

        public List<AccountsBasePresentation> GetAll()
        {
            return this.context.Account
                            .Select(s => new AccountsBasePresentation { 
                                Id = s.Id??0,
                                AccountName = s.AccountName.Trim()
                             })
                            .ToList();
        }

        public List<AccountDetailsPresentation> GetAllAccountsWithDetail(int month, string userLogged)
        {
            var resultAccountsInbound = this.context.Launch
                                              .Where(w => w.TypeLaunch == TypeLaunchEnum.Receita.ToDescriptionString()
                                                        && w.Day.Month == month
                                                    )
                                              .GroupBy(g => g.AccountId)
                                              .Select(s => new 
                                                            AccountDetailsPresentation 
                                                            {
                                                                AccountId = s.Key,
                                                                Value = s.Sum(a => a.ValueExec),
                                                            }
                                                        )
                                              .ToList();

            var resultAccountsOutbound = this.context.Launch
                                              .Where(w => w.TypeLaunch == TypeLaunchEnum.Despesa.ToDescriptionString()
                                                    && w.Day.Month == month
                                                )
                                              .GroupBy(g => g.AccountId)
                                              .Select(s => new
                                                            AccountDetailsPresentation
                                                            {
                                                                AccountId = s.Key,
                                                                Value = s.Sum(a => a.ValueExec) * -1,
                                                            }
                                                        )
                                              .ToList();

            var resultAccounts = resultAccountsInbound.Union(resultAccountsOutbound)
                                                      .GroupBy(g => g.AccountId)
                                                      .Select(s => new 
                                                                    AccountDetailsPresentation 
                                                                    { 
                                                                        AccountId = s.Key, 
                                                                        Value =s.Sum(a=> a.Value)
                                                                    })
                                                       .ToList();

            resultAccounts.ForEach(f => {
                                            f.AccountName = GetAccountName(f.AccountId).Trim();
                                            f.LastUpdate = GetLastDay(f.AccountId);
                                        }
                                    );

            return resultAccounts;
        }

        public List<AccountsByUserPresentation> GetAccountByUser(int userID)
        {
            return (from c in context.Account
                    join uc in context.UserAccounts on c.Id equals uc.AccountID into ucLeftJoin
                    from uc in ucLeftJoin.DefaultIfEmpty()
                    //where uc.UserID == userID by family
                    select new AccountsByUserPresentation
                    {
                        Id = c.Id??0,
                        AccountName = c.AccountName.Trim(),
                        PreferencialAccount = uc.Preferencial!=null,
                    }).ToList();
        }

        private DateTime? GetLastDay(int accountId)
        {

            return this.context.Launch
                                .Where(w => w.DateCreated != null && w.AccountId == accountId)
                                .OrderByDescending(o => o.DateCreated)
                                .FirstOrDefault()?
                                .DateCreated;
        }

        private string GetAccountName(int key)
        {
            return this.context.Account.FirstOrDefault(f => f.Id == key).AccountName;
        }
    }
}