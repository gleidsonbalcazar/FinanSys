using FinansysControl.Data;
using System.ComponentModel.DataAnnotations;

namespace FinansysControl.Models
{
    public class Account : IEntity
    {

        public int? Id { get; set; }

        [Required]
        public string  AccountName { get; set; }

    }
}
