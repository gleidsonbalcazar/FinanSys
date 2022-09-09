
using System;
using System.Collections.Generic;

namespace FinansysControl.Models
{
    public class Import 
    {

        public int Id { get; set; }
        public string FileName { get; set; }

        public DateTime DateCreated {get;set;}

        public string UserCreated { get; set; }

        public virtual List<ImportData> ImportData { get; set; }

    }
}
