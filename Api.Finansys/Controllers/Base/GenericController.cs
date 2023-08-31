using System.Collections.Generic;
using System.Threading.Tasks;
using FinansysControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Base;

namespace Api.FinanSys.Controllers.Base
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public abstract class GenericController<TEntity, TRepository> : ControllerBase
                        where TEntity : class, IEntity
                        where TRepository : IRepository<TEntity>
    {
        private readonly TRepository _repository;

        public GenericController(TRepository repository)
        {
            _repository = repository;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<TEntity>>> Get()
        {
            return await _repository.GetAll();

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TEntity>> Get(int id)
        {
            var entity = await _repository.Get(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, TEntity entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }
            await _repository.Update(entity);
            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpPost]
        public async Task<ActionResult<TEntity>> Post(TEntity entity)
        {

            await _repository.Add(entity);
            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<TEntity>> Delete(int id)
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

