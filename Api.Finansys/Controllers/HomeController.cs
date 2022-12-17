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