using System;
using System.Linq;
using System.Threading;
using Api.FinanSys.Models.Presentations;
using Api.FinanSys.Services;
using Castle.Core.Resource;
using FinansysControl.Data;
using FinansysControl.Helpers;
using FinansysControl.Models.Auth;
using FinansysControl.Services;

namespace Repository
{
    public class UserRepository
    {
        private readonly FinansysContext _context;
        private readonly string _pepper;
        private readonly int _iteration = 3;

        public UserRepository(FinansysContext context)
        {
            _context = context;
        }

        public UserPresentation GetUser(string username, string password)
        {
            var user = _context.User
             .FirstOrDefault(x => x.Username == username);

            if (user == null)
                throw new Exception("Usuário/Password inválidos.");

            var passwordHash = PasswordHasher.ComputeHash(password, user.PasswordSalt, _pepper, _iteration);

            if (user.PasswordHash != passwordHash)
                throw new Exception("Usuário/Password inválidos.");

            return new UserPresentation
            {
                Id = user.Id,
                Username = username,
            };
        }

        public User RegisterUser(string username, string password)
        {
            var passwordSalt = PasswordHasher.GenerateSalt();

            CheckIfExists(username);

            var user = new User
            {
               Username = username,
               PasswordSalt = PasswordHasher.GenerateSalt(),
            };

            user.PasswordHash = PasswordHasher.ComputeHash(password, user.PasswordSalt, _pepper, _iteration);

            _context.User.Add(user);
            _context.SaveChanges();

            return user;
        }

        private void CheckIfExists(string username)
        {
            var user = _context.User.FirstOrDefault(f => f.Username == username);

            if(user != null)
            {
                throw new AppException("Não foi possível registrar o usuário, pois ele já existe");
            }
        }

        public string RecordToken(UserPresentation user){
            var token = TokenService.GenerateToken(user);
            return token;
        }
    }
}