using FinansysControl.Data;
using System.ComponentModel.DataAnnotations;

namespace Api.FinanSys.Models.Entities
{
    public class Account : IEntity
    {

        public int? Id { get; set; }

        [Required]
        public string AccountName { get; set; }

    }
}
