using System.Collections.Generic;
using System.Threading.Tasks;
using Api.FinanSys.Models.Presentations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace Api.FinanSys.Controllers.Home
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HomeController : Controller
    {
        private readonly HomeRepository _repository;
        public HomeController(HomeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("{month}/{year}")]
        public ActionResult<IEnumerable<HomePresentation>> Get(int month, int year)
        {
            return _repository.GetPainel(month, year);
        }

        [HttpGet("resume/{month}/{year}")]
        public ActionResult<HomeResumePresentation> GetPainelResume(int month, int year)
        {
            return _repository.GetPainelResume(month, year);
        }
    }
}