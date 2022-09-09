using System.Collections.Generic;
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
        public async Task<ActionResult<IEnumerable<Budget>>> Get()
        {
            return await _repository.GetAll();

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
        public async Task<IActionResult> Put(int id, Budget entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }

            await _repository.Update(entity);

            if(entity.Month == 0){
                _repository.UpdateAllMonth(entity);
            }

            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpPost]
        public async Task<ActionResult<Budget>> Post(Budget entity)
        {
            await _repository.Add(entity);
            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Budget>> Delete(int id)
        {
            var entity = await _repository.Delete(id);
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