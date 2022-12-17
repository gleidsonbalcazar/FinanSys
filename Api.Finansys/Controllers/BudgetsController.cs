using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.FinanSys.Models.ViewModels;
using FinansysControl.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace FinansysControl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //Authorize]
    public class BudgetsController : Controller
    {
        private readonly BudgetRepository _repository;
        public BudgetsController(BudgetRepository repository) 
        {
            this._repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Budget>>> Get(bool allFields = false)
        {
            return await _repository.GetAllFilter(x => !allFields ? x.Active==true : x.Active == true || x.Active == false, o => o.OrderBy(a => a.Description));
        }

        [HttpGet("{month}/{year}")]
        public async Task<ActionResult<IEnumerable<Budget>>> Get(int month, int year)
        {
            return await _repository.GetAllFilter(w => w.BudgetConfig.Any(), o => o.OrderBy(a => a.Description), u => u.BudgetConfig.Where(w => w.Year == year && w.Month == month));
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Budget>> Get(int id)
        {
            var entity = await _repository.Get(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, BudgetReq budgetReq)
        {
            if (id != budgetReq.Id)
            {
                return BadRequest();
            }

            _repository.UpdateBudget(budgetReq);

            _repository.UpdateConfig(id, budgetReq);

            return CreatedAtAction("Get", new { id = budgetReq.Id }, budgetReq);
        }


        [HttpPost]
        public async Task<ActionResult<Budget>> Post(BudgetReq budgetReq)
        {

            var budget = _repository.AddBudget(budgetReq);

            if(budget.Id != null)
            {
                _repository.UpdateConfig(budget.Id, budgetReq);

            }

            return CreatedAtAction("Get", new { id = budget.Id }, budgetReq);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Budget>> Delete(int id)
        {
            var entity = await _repository.DeleteBudget(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        [HttpPost("addWord")]
        public ActionResult<BudgetWords> AddWord(BudgetWordReq budget)
        {
            var result = _repository.AddNewWord(budget);
            if (result.Id == null)
            {
                return NotFound();
            }
            return CreatedAtAction("Get", new { id = result.Id }, result);
        }

        [HttpPut("updateWord/{id}")]
        public async Task<IActionResult> Put(int id, BudgetWords entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }

            _repository.UpdateWord(id,entity);


            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpDelete("removeWord/{id}")]
        public async Task<ActionResult<BudgetWords>> DeleteBudgetWord(int id)
        {
            var entity = await _repository.DeleteBudgetWords(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }
    }
}