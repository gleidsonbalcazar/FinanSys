using System.Collections.Generic;
using System.Threading.Tasks;
using Api.FinanSys.Models.Presentations;
using FinansysControl.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace Api.FinanSys.Controllers.Indicators
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IndicatorsController : Controller
    {
        private readonly IndicatorsRepository _repository;
        public IndicatorsController(IndicatorsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("{id}")]
        public ActionResult<IEnumerable<BudgetMonthExecutedPresentation>> Get(int id)
        {
            return _repository.GetLineBudgetIndicators(id);
        }

    }
}