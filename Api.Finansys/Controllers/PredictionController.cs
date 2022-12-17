using System.Collections.Generic;
using System.Threading.Tasks;
using FinansysControl.Models;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace FinansysControl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //Authorize]
    public class PredictionController : Controller
    {
        private readonly PredictionRepository _repository;
        public PredictionController(PredictionRepository repository) 
        {
            this._repository = repository;
        }

         [HttpGet]
        public async Task<ActionResult<IEnumerable<Prediction>>> Get()
        {
            return await _repository.GetAll();

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Prediction>> Get(int id)
        {
            var entity = await _repository.Get(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Prediction entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }

            await _repository.Update(entity);

            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpPost]
        public async Task<ActionResult<Prediction>> Post(Prediction entity)
        {
            await _repository.Add(entity);
            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Prediction>> Delete(int id)
        {
            var entity = await _repository.Delete(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }
    }
}