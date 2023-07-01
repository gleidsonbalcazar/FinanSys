import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { AppService } from 'src/app/app.service';
import { Account } from 'src/app/class/account.interface';
import { homeResume } from 'src/app/class/homeResume.interface';
import { Budget } from '../../class/budget.class';
import { home } from '../../class/home.interface';
import { launch } from '../../class/launch.interface';
import { DashboardService } from './dashboard.service';
import { LaunchService } from '../launch/launch.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LaunchModalComponent } from '../launch/launch-modal/launch.modal.component';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.css'],
  templateUrl: './dashboard.component.html'
})
export class DashBoardComponent implements OnInit{
  public searchText!: string;
  public launchs!: launch[];
  public budgets!: Budget[];
  public painel!: home[];
  public accounts!: Account[];
  public monthId!: number;
  public year!: number;
  public homeResume!: homeResume;


  constructor(
    private painelService: DashboardService,
    public appService:AppService,
    public launchService: LaunchService,
    public modalService: NgbModal,
    ) {

  }

  ngOnInit() {
    this.getAccounts();
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

  public getMonthDescription():string{
    return this.appService.months.find(f => f.id == this.monthId).name;
  }

  public getLastDate(date:any):string{
    return `Ultima atualização em: ${moment(date).format("DD/MM/YYYY hh:mm:ss")}`;
  }

  ifAvailableToLaunch(b:any){
    return (b.valueExec || b.valuePrev) < b.valueOrc;
  }

  addToLaunch(b:any){
    const modalRef = this.modalService.open(LaunchModalComponent,{ windowClass : "modal-pre-lg"});
    modalRef.componentInstance.title = "Realizar Lançamento do Budget";
  }

  checkLastDateUpdated(date:any):boolean{
    const dateReg = new Date(date).getTime();
    const dateIn = new Date();
    return dateReg <= dateIn.setDate(dateIn.getDate()-7);
  }

  public getAccounts(){
    this.painelService.getAccounts().subscribe( s => {
      this.accounts = s;
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
