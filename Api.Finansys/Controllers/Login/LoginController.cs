using System.Threading.Tasks;
using Api.FinanSys.Models.Requests;
using FinansysControl.Helpers;
using FinansysControl.Models.Auth;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace Api.FinanSys.Controllers.Login
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        private readonly UserRepository _userRepository;

        public LoginController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("authenticate")]
        public async Task<ActionResult<dynamic>> Authenticate([FromBody] LoginRequest request)
        {
            var user = _userRepository.GetUser(request.UserName, request.Password);

            if (user == null)
                throw new AppException("Usuário ou senha inválidos");

            string token = _userRepository.RecordToken(user);

            return new
            {
                user.Username,
                token
            };
        }


        [HttpPost("register")]
        public async Task<ActionResult<dynamic>> Register([FromBody] RegisterRequest request)
        {
            var user = _userRepository.RegisterUser(request.UserName, request.Password);

            if (user == null)
                throw new AppException("Não foi possível registrar o usuário");


            return user;
        }
    }
}