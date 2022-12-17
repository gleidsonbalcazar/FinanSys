using System.Collections.Generic;
using System.Threading.Tasks;
using FinansysControl.Models;
using FinansysControl.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace FinansysControl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class IndicatorsController : Controller
    {
        private readonly IndicatorsRepository _repository;
        public IndicatorsController(IndicatorsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("{id}")]
        public ActionResult<IEnumerable<BudgetMonthIndicatorExecuted>> Get(int id)
        {
            return _repository.GetLineBudgetIndicators(id);
        }

    }
}