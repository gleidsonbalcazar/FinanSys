using System.Linq;
using FinansysControl.Data;
using FinansysControl.Models.Auth;
using FinansysControl.Services;

namespace Repository
{
    public class UserRepository
    {
        private readonly FinansysContext _context;
        public UserRepository(FinansysContext context)
        {
            _context = context;
        }

        public User GetUser(string username, string password)
        {
            var user = _context.User.Where(x => x.Username.ToLower() == username.ToLower() && x.Password == password).FirstOrDefault();
            
            return user;
        }

        public string RecordToken(User user){
            var token = TokenService.GenerateToken(user);
            return token;
        }
    }
}