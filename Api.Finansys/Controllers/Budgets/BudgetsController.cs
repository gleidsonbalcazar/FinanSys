using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.FinanSys.Models.Entities;
using Api.FinanSys.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace FinansysControl.Controllers.Budgets
{
    [Route("api/[controller]")]
    [ApiController]
    //Authorize]
    public class BudgetsController : Controller
    {
        private readonly BudgetRepository budgetRepository;

        public BudgetsController(BudgetRepository budgetRepository) 
        {
            this.budgetRepository = budgetRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Budget>>> Get(bool allFields = false)
        {
            return await budgetRepository.GetAllFilter(x => !allFields ? x.Active==true : x.Active == true || x.Active == false, o => o.OrderBy(a => a.Description));
        }

        [HttpGet("{month}/{year}")]
        public async Task<ActionResult<IEnumerable<Budget>>> Get(int month, int year)
        {
            return await budgetRepository.GetAllFilter(w => w.BudgetConfig.Any(), o => o.OrderBy(a => a.Description), u => u.BudgetConfig.Where(w => w.Year == year && w.Month == month));
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Budget>> Get(int id)
        {
            var entity = await budgetRepository.Get(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, BudgetRequest budgetReq)
        {
            if (id != budgetReq.Id)
            {
                return BadRequest();
            }

            budgetRepository.UpdateBudget(budgetReq);

            return CreatedAtAction("Get", new { id = budgetReq.Id }, budgetReq);
        }


        [HttpPost]
        public async Task<ActionResult<Budget>> Post(BudgetRequest budgetReq)
        {

            var budget = budgetRepository.AddBudget(budgetReq);

            return CreatedAtAction("Get", new { id = budget.Id }, budgetReq);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Budget>> Delete(int id)
        {
            var entity = await budgetRepository.DeleteBudget(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }


        [HttpDelete("budgetConfig/{id}")]
        public async Task<ActionResult<BudgetConfig>> DeleteBudgetConfig(int budgetId)
        {
            var entity = await budgetRepository.RemoveBudgetConfig(budgetId);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        [HttpPost("addWord")]
        public ActionResult<BudgetWords> AddWord(BudgetWordRequest budget)
        {
            var result = budgetRepository.AddNewWord(budget);
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

            budgetRepository.UpdateWord(id,entity);


            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpDelete("removeWord/{id}")]
        public async Task<ActionResult<BudgetWords>> DeleteBudgetWord(int id)
        {
            var entity = await budgetRepository.DeleteBudgetWords(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }
    }
}