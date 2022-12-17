using System;
using System.Collections.Generic;
using System.Linq;
using FinansysControl.Models;
using OfficeOpenXml;
using Repository;

namespace FinansysControl.Services
{
    public class ImportService
    {
        private readonly BudgetRepository budgetRepository;
        private readonly LaunchRepository launchRepository;
        public List<ImportModel> DataList = new List<ImportModel>();
        public List<Budget> BudgetsWithWords = new List<Budget>();
        public string fileName;
        public bool FileWasImported = false;

        public ImportService(
                BudgetRepository budgetRepository,
                LaunchRepository launchRepository
        ) { 
            this.budgetRepository = budgetRepository;
            this.launchRepository = launchRepository;
        }

        public ImportService Process(string file, BankEnum bank = BankEnum.Millenium)
        {
            this.fileName = file.Substring(18);
            using (var package = new ExcelPackage(file))
            {
                var workSheet = package.Workbook.Worksheets.First();
                int totalRows = workSheet.Dimension.Rows;
                FileWasImported = CheckIfFileWasImported();

                GetBudgetsWords();

                switch (bank)
                {
                    case BankEnum.Millenium:
                        RunImportMilleniumBank(workSheet, totalRows - 1);
                        break;
                    case BankEnum.ActiveBank:
                        RunImportActiveBank(workSheet, totalRows - 1);
                        break;
                    default:
                        break;
                }

                RemoveWasImported();

                GetProspectiveLoaded();

            }

            return this;
        }

        private void RemoveWasImported()
        {
            this.DataList = launchRepository.RemoveWasImported(this.DataList);
        }

        private bool CheckIfFileWasImported()
        {
            return launchRepository.CheckIfFileWasImported(this.fileName);
        }

        private void GetProspectiveLoaded()
        {
            this.DataList.ForEach(f => { f.ProspectiveLoaded = CheckIfLoaded(f); });
        }

        private bool CheckIfLoaded(ImportModel f)
        {
            return launchRepository.CheckIfLoaded(f);
        }

        private void GetBudgetsWords()
        {
           this.BudgetsWithWords = budgetRepository.GetAll().Result.Where(w => w.BudgetWords.Any()).ToList();
        }

        private void RunImportMilleniumBank(ExcelWorksheet workSheet, int totalRowsToRun)
        {
            for (int i = 14; i <= totalRowsToRun; i++)
            {
                DataList.Add(new ImportModel
                {
                    DateLaunch = Convert.ToDateTime(workSheet.Cells[i, 1].Value.ToString()),
                    Description = GetRealDescription(workSheet.Cells[i, 3].Value.ToString()),
                    TypeLaunch = workSheet.Cells[i, 5].Value.ToString(),
                    ValueLaunch = TransformMilleniumValueLaunch(workSheet.Cells[i, 5].Value.ToString(), Convert.ToDecimal(workSheet.Cells[i, 4].Value.ToString())),
                    ProspectiveBudgetId = GetPossibleBudgetByWord(workSheet.Cells[i, 3].Value.ToString()),
                });
            }
        }

        private string GetRealDescription(string bankDescription)
        {
            return bankDescription.Replace("COMPRA", "").Replace("8551","").Replace("PAG","").Replace("BXVAL","").Replace("PAG SERV","").Replace("3728","");
        }

        private decimal TransformMilleniumValueLaunch(string typeLaunch, decimal valueLaunch)
        {
            if (valueLaunch < 0)
            {
                return valueLaunch * -1;
            }

            return valueLaunch;
           
        }

        private void RunImportActiveBank(ExcelWorksheet workSheet, int totalRowsToRun)
        {
            for (int i = 9; i <= totalRowsToRun; i++)
            {
                DataList.Add(new ImportModel
                {
                    DateLaunch = Convert.ToDateTime(workSheet.Cells[i, 1].Value.ToString()),
                    Description = workSheet.Cells[i, 3].Value.ToString(),
                    TypeLaunch = ReturnTypeToActiveBank(workSheet.Cells[i, 4].Value.ToString()),
                    ValueLaunch = TransformActiveValueLaunch(workSheet.Cells[i, 4].Value.ToString()),
                    ProspectiveBudgetId = GetPossibleBudgetByWord(workSheet.Cells[i, 3].Value.ToString()),
                });
            }
        }

        private decimal TransformActiveValueLaunch(string value)
        {
            var valueExec = Convert.ToDecimal(value);
            if (valueExec >= 0)
            {
                return valueExec;
            }
            else
            {
                return valueExec * -1;
            }
        }

        private string ReturnTypeToActiveBank(string value)
        {
            var valueExec = Convert.ToDecimal(value);
            if(valueExec >= 0)
            {
                return "Crédito";
            }
            else
            {
                return "Débito";
            }
        }

        private int? GetPossibleBudgetByWord(string description)
        {
            var descSplit =  description.ToUpper().Split(" ");
            var allBudgets = this.BudgetsWithWords.ToList();
            foreach (var budgets in allBudgets)
            {
              var budgetObj = budgets.BudgetWords.FirstOrDefault(w=> descSplit.Contains(w.BudgetWord.Trim().ToUpper()));
              if (budgetObj!=null)
              {
                    return budgetObj.BudgetId;
              }
            }
            return null;
        }
    }
}