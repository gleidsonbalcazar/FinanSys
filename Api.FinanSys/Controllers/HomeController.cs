using System.Collections.Generic;
using System.Threading.Tasks;
using FinansysControl.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace FinansysControl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class HomeController : Controller
    {
        private readonly HomeRepository _repository;
        public HomeController(HomeRepository repository) 
        {
            _repository = repository;
        }

        // [HttpGet("teste/{id}")]
        // public Task<ActionResult<Home>> Get2(int id)
        // {
        //     // Return an asynchronous list of heroes that satisfy query
        //     HomeResume homeResume = _repository.GetPainelResume(id);
        //     return null;
        // }

        [HttpGet("{month}/{year}")]
        public ActionResult<IEnumerable<Home>> Get(int month, int year)
        {
            return _repository.GetPainel(month, year);
        }

         [HttpGet("resume/{month}/{year}")]
        public ActionResult<HomeResume> GetPainelResume(int month, int year)
        {
            return _repository.GetPainelResume(month, year);
        }
    }
}