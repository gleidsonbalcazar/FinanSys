using Api.FinanSys.Models.Entities;
using Api.FinanSys.Models.ViewModels;
using FinansysControl.Models.Auth;
using Microsoft.EntityFrameworkCore;

namespace FinansysControl.Data
{
    public class FinansysContext : DbContext
    {

        public FinansysContext (DbContextOptions<FinansysContext> options)
            : base(options)
        {
             
        }

        public DbSet<Budget> Budget { get; set; }

        public DbSet<BudgetPlan> BudgetPlan { get; set; }
        public DbSet<BudgetConfig> BudgetConfig { get; set; }
        public DbSet<BudgetWords> BudgetWords { get; set; }
        public DbSet<Launch> Launch { get; set; }

        public DbSet<Account> Account { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Import> Import { get; set; }
        public DbSet<ImportData> ImportData { get; set; }
    }
}
