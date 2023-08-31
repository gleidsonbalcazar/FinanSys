using FinansysControl.Data;

namespace Api.FinanSys.Models.Entities
{
    public class UserAccounts : IEntity
    {
        public int? Id { get; set; }

        public int UserID { get; set; }

        public int AccountID { get; set; }

        public bool Preferencial { get; set; }
    }
}
