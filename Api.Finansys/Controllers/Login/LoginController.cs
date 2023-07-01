using System.Threading.Tasks;
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

        [HttpPost]
        public async Task<ActionResult<dynamic>> Authenticate([FromBody] User model)
        {
            var user = _userRepository.GetUser(model.Username, model.Password);

            if (user == null)
                throw new AppException("Usuário ou senha inválidos");

            string token = _userRepository.RecordToken(user);
            user.Password = "";
            return new
            {
                user,
                token
            };
        }
    }
}