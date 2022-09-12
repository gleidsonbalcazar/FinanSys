using Api.FinanSys.Models.ViewModels;
using FinansysControl.Data;
using FinansysControl.Helpers.Enum;
using FinansysControl.Models;
using Repository.Base;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repository
{
    public class AccountRepository : EfCoreGenericRepository<Account, FinansysContext>
    {
        private readonly FinansysContext _context;
        public AccountRepository(FinansysContext context) : base(context)
        {
            this._context = context;
        }

        public List<AccountViewModel> GetAll()
        {
            var resultAccountsInbound = this._context.Launch
                                              .Where(w => w.TypeLaunch == TypeLaunchEnum.Receita.ToDescriptionString())
                                              .GroupBy(g => g.AccountId)
                                              .Select(s => new 
                                                            AccountViewModel 
                                                            {
                                                                AccountId = s.Key,
                                                                Value = s.Sum(a => a.ValueExec),
                                                            }
                                                        )
                                              .ToList();

            var resultAccountsOutbound = this._context.Launch
                                              .Where(w => w.TypeLaunch == TypeLaunchEnum.Despesa.ToDescriptionString())
                                              .GroupBy(g => g.AccountId)
                                              .Select(s => new
                                                            AccountViewModel
                                                            {
                                                                AccountId = s.Key,
                                                                Value = s.Sum(a => a.ValueExec) * -1,
                                                            }
                                                        )
                                              .ToList();

            var resultAccounts = resultAccountsInbound.Union(resultAccountsOutbound)
                                                      .GroupBy(g => g.AccountId)
                                                      .Select(s => new 
                                                                    AccountViewModel 
                                                                    { 
                                                                        AccountId = s.Key, 
                                                                        Value =s.Sum(a=> a.Value)
                                                                    })
                                                       .ToList();

            resultAccounts.ForEach(f => {
                                            f.AccountName = GetAccountName(f.AccountId);
                                            f.LastUpdate = GetLastDay(f.AccountId);
                                        }
                                    );

            return resultAccounts;
        }

        private DateTime? GetLastDay(int accountId)
        {

            return this._context.Launch
                                .Where(w => w.DateCreated != null && w.AccountId == accountId)
                                .FirstOrDefault()?
                                .DateCreated;
        }

        private string GetAccountName(int key)
        {
            return this._context.Account.FirstOrDefault(f => f.Id == key).AccountName;
        }
    }
}