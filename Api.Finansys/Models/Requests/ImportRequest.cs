using System;
using System.Collections.Generic;

namespace Api.FinanSys.Models.Requests
{
    public class ImportRequest
    {
        public string FileName { get; set; }
        public List<ImportModel> importModel { get; set; }
    }
}
