using Api.FinanSys.Models.Entities;
using System;
using System.Collections.Generic;

public class ImportModel {
    public DateTime DateLaunch { get; set; }
    public string Description { get; set; }
    public decimal ValueLaunch { get; set; }
    public string TypeLaunch { get; set; }

    public int? ProspectiveBudgetId {get;set;}
    public bool ProspectiveLoaded {get;set;}

    public IEnumerable<Launch> LaunchsProspectiveLoaded { get; set; }

}