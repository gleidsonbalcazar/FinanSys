using FinansysControl.Data;
using FinansysControl.Models;
using Repository.Base;

namespace Repository
{
    public class PredictionRepository : EfCoreGenericRepository<Prediction, FinansysContext>
    {
        private readonly FinansysContext _context;
        public PredictionRepository(FinansysContext context) : base(context)
        {
            this._context = context;
        }

    }
}