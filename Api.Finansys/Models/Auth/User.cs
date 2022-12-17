using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FinansysControl.Models.Auth
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
