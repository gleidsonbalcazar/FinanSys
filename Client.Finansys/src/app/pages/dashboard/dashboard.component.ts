import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { homeResume } from 'src/app/class/homeResume.interface';
import { budget } from '../../class/budget.interface';
import { home } from '../../class/home.interface';
import { launch } from '../../class/launch.interface';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.css'],
  templateUrl: './dashboard.component.html'
})
export class DashBoardComponent implements OnInit{
  public searchText!: string;
  public launchs!: launch[];
  public budgets!: budget[];
  public painel!: home[];
  public monthId!: number;
  public year!: number;
  public homeResume!: homeResume;


  constructor(
    private painelService: DashboardService,
    public  appService:AppService
    ) {

  }

  ngOnInit() {
    this.appService.getMonth().subscribe(id => {
      this.monthId = id;
      this.appService.getYear().subscribe(y => {
        this.year = y;
        this.getPainel();
      })
    })
  }

  public getPainel() {
    this.painelService.getPainel(this.monthId, this.year).subscribe( (s) => {
      this.painel = s;
    });

    this.painelService.getPainelResume(this.monthId, this.year).subscribe( (s) => {
      this.homeResume = s;
    });
  }

  public classTypeBudget(type:string):string{
    return type === 'R' ? 'line-r' : 'line-d'
  }

  public getPercentual(value){
    if(isNaN(value)){
      return 0.0;
    }
    return value;
  }

  public getClass(value){
    if(isNaN(value)){
      value = 0.0;
    }
    switch (true) {
      case value>=100:
        return 'pborder pbad'
        break;
      case value<50:
        return 'pborder pgood'
        break;
      case value>50&&value<=99.99:
        return 'pborder pdefault'
        break;
    }
  }

}
