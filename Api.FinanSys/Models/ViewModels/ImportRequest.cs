using System;
using System.Collections.Generic;

public class ImportRequest {
    public string FileName { get; set; }
    public List<ImportModel> importModel { get; set; }
}