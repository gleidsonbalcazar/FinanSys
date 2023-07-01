
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Api.FinanSys.Models.Entities;
using Api.FinanSys.Models.ViewModels;
using FinansysControl.Data;
using FinansysControl.Models;
using Repository.Base;

namespace Repository
{
    public class BudgetPlanRepository : EfCoreGenericRepository<BudgetPlan, FinansysContext>
    {
        private readonly FinansysContext _context;
        public BudgetPlanRepository(FinansysContext context) : base(context)
        {
            this._context = context;
        }
    }
}