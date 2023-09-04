
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.FinanSys.Models.Entities;
using Api.FinanSys.Models.Requests;
using Api.FinanSys.Models.ViewModels;
using FinansysControl.Data;
using Microsoft.AspNetCore.Mvc;
using Repository.Base;

namespace Repository
{
    public class LaunchRepository : EfCoreGenericRepository<Launch, FinansysContext>
    {
        private readonly FinansysContext _context;
        public LaunchRepository(FinansysContext context) : base(context)
        {
            this._context = context;
        }

        public ActionResult<IEnumerable<Launch>> GetAllOrdered(int month, int year, int accountID)
        {
            var launchs = this._context.Launch.Where(s => s.Day.Month == month || month == 0)
                                              .Where(s => s.Day.Year == year || year == 0)
                                              .OrderByDescending(s => s.Day).ToList();
           if(accountID > 0)
           {
               launchs.RemoveAll(w => w.AccountId != accountID);
           }

           return launchs.OrderByDescending(o => o.ValuePrev > o.ValueExec).ToList();
        }

        public ActionResult<bool> CheckDuplicate(Launch launch)
        {
            return this._context.Launch.Any(w => w.Day.Month == launch.Day.Month && w.Day.Year == launch.Day.Year
                                            && (launch.ValueExec > 0 ? w.ValueExec == launch.ValueExec : false || launch.ValuePrev > 0 ? w.ValuePrev == launch.ValuePrev: false)
                                            );
        }

        public bool CheckIfLoaded(ImportModel f)
        {
            var existsValueOnLaunch = this._context.Launch.Any(w => f.ValueLaunch > 0 ? w.ValueExec == f.ValueLaunch : false || f.ValueLaunch > 0 ? w.ValuePrev == f.ValueLaunch: false);
            var existsImportWithValue = this._context.ImportData.Any(w => w.ValueLaunch == f.ValueLaunch);

            return existsValueOnLaunch && existsImportWithValue;
        }

        public async Task<ImportRequest> ProcessImport(ImportRequest importRequest, int accountId)
        {
            var launchListMapped = importRequest.importModel.Select(s => new Launch {
                                                        AccountId = accountId,
                                                        Active = true,
                                                        BudgetId = s.ProspectiveBudgetId.Value,
                                                        Day = s.DateLaunch,
                                                        Description = s.Description,
                                                        TypeLaunch = s.TypeLaunch == "Crédito" ? "R" : "D",
                                                        DateCreated = DateTime.Now,
                                                        UserCreated = "ImportAdmin",
                                                        ValueExec =  s.ValueLaunch,
                                                        ValuePrev = 0,
            });

            this._context.Launch.AddRange(launchListMapped);

            UpdateBudgetWords(launchListMapped);

            CreateRegisterImport(launchListMapped, importRequest);

            await this._context.SaveChangesAsync();

            return importRequest;
        }

        public List<ImportModel> RemoveWasImported(List<ImportModel> dataList)
        {
            dataList.RemoveAll(w =>  this._context.ImportData.Any(a => a.ValueLaunch == w.ValueLaunch && a.DateLaunch == w.DateLaunch));
            return dataList;
        }

        private void UpdateBudgetWords(IEnumerable<Launch> launchListMapped)
        {
           foreach (var launch in launchListMapped)
           {
                var listWordsSplitted = launch.Description.Split(' ');
                
                if(listWordsSplitted.Length > 0)
                {
                    foreach (var word in listWordsSplitted)
                    {
                        if(!this._context.BudgetWords.Any(x => x.BudgetWord  == word && x.BudgetId == launch.BudgetId) && !string.IsNullOrEmpty(word))
                        {
                            CreateNewBudgetWord(launch.BudgetId,word);
                        }
                    }
                }
           }
        }

        private void CreateNewBudgetWord(int budgetId, string word)
        {
            var budget = this._context.Budget.FirstOrDefault(f => f.Id == budgetId);
            budget.BudgetWords.Add(new BudgetWords { BudgetId = budgetId, BudgetWord = word, DateCreated = DateTime.Now, UserCreated = "ImportAdmin" });

            this._context.SaveChanges();
        }

        private void CreateRegisterImport(IEnumerable<Launch> launchListMapped, ImportRequest importRequest)
        {
            var data = launchListMapped.Select(s => new ImportData {
                                                        AccountId = s.AccountId,
                                                        DateCreated = DateTime.Now,
                                                        DateLaunch = s.Day,
                                                        Description = s.Description,
                                                        ProspectiveBudgetId = s.BudgetId,
                                                        SelectedBudgetId = s.BudgetId,
                                                        ProspectiveLoaded = false,
                                                        TypeLaunch = s.TypeLaunch,
                                                        UserCreated = s.UserCreated,
                                                        ValueLaunch = s.ValueExec,
                                              }).ToList();

            var importRegister = new Import { DateCreated = DateTime.Now, FileName = importRequest.FileName, UserCreated = "ImportAdmin", ImportData = data };

            this._context.Import.AddRange(importRegister);
            this._context.SaveChanges();
        }

        public bool CheckIfFileWasImported(string fileName)
        {
            return this._context.Import.Any(w => w.FileName == fileName);
        }
    }
}