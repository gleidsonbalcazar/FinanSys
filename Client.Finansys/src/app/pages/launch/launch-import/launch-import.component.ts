import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Account } from 'src/app/class/account.interface';
import { Banks } from 'src/app/class/banks.interface';
import { budget } from 'src/app/class/budget.interface';
import { ImportBank } from 'src/app/class/importBank.interface';
import { BudgetService } from '../../budget/budget.service';
import { LaunchService } from '../launch.service';
import { ImportRequest } from '../../../class/importRequest.class';
import * as moment from "moment";

@Component({
  selector: 'launch-import',
  templateUrl: './launch-import.component.html',
  styleUrls: ['./launch-import.component.css']
})
export class LaunchImportComponent {
  importResponse!:ImportBank[];
  dataWithAutoBudget!:ImportBank[];
  dataWithOutAutoBudget!:ImportBank[];
  public typeBudgets: budget[] = [];
  public banks:Banks[] = [];
  public accounts: Account[] = [];
  public alertMsg: string = '';
  public submitted:boolean = false;
  public fileName:string;
  public fileWasImported:boolean;
  public isCollapsedBudget = true;
  public isCollapsedBudgetWithout = true;
  public bankSelected:Banks;
  public accountSelected:Account;
  public numberAutoBudgetWasImported:number = 0;
  public numberWithoutBudgetWasImported:number = 0;

  constructor(
    private budgetService: BudgetService,
    private launchService: LaunchService,
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router
    ) {
      this.getTypeBudgets();
      this.getBanks();
      this.getAccounts();
    }

  getAccounts() {
    this.accounts = this.appService.accounts;
    this.accounts.unshift({id:0,accountName:"-- Selecione a Conta --"});
  }

  getBanks() {
    this.banks.push({id:0,name:"-- Selecione o Banco --"});
    this.banks.push({id:1,name:"Millenium"});
    this.banks.push({id:2,name:"ActiveBank"});
  }

  getTypeBudgets() {
    this.budgetService.findAll(null).subscribe((s) =>
                                            {
                                              this.typeBudgets = s;
                                              this.typeBudgets.push(
                                                { id: null,
                                                  description: '**Selecione o Orçamento',
                                                  value: 0,
                                                  typeBudget:null,
                                                  active: true,
                                                  averageValue: 0,
                                                  budgetConfig: [],
                                                  budgetWords:[]
                                                });
                                            });
  }

  returnData(receiveData:any){
    return moment(receiveData).format("YYYY-MM-DD");
  }

  getTitleByLaunch(res){
    return "Este lançamento provávelmente pode estar duplicado";
  }

  showUploadField():boolean{
    return this.bankSelected?.id > 0 && this.accountSelected?.id > 0;
  }

  uploadFinished = (event:any) => {
    this.importResponse = event.importModel;
    this.dataWithAutoBudget = this.importResponse.filter(f => f.prospectiveBudgetId != null);
    this.dataWithOutAutoBudget = this.importResponse.filter(f => f.prospectiveBudgetId == null);
    this.numberAutoBudgetWasImported = this.dataWithAutoBudget.filter(f => f.prospectiveLoaded).length;
    this.numberWithoutBudgetWasImported = this.dataWithOutAutoBudget.filter(f => f.prospectiveLoaded).length;

    this.fileName = event.fileName;
    this.fileWasImported = event.fileWasImported;
  }


  onChangeProspectiveBudget(obj:ImportBank, value){
      obj.prospectiveBudgetId = Number(value);
      if(!obj.selectedToImport){
        obj.selectedToImport = true;
      }
  }

  changeData(obj:ImportBank,value){
    obj.dateLaunch = new Date(value);
  }

  getBudgetProspective(id){
    return this.typeBudgets.find(x => x.id === id)?.description;
  }

  onChangeInput(obj:ImportBank){
    obj.selectedToImport = !obj.selectedToImport;
  }

  execute(obj):void{
    let accountId = obj.id;
    this.submitted = true;
    let dataToImport = this.dataWithAutoBudget.filter((f) => f.selectedToImport).concat(this.dataWithOutAutoBudget.filter((f) => f.selectedToImport));
    const importRequest = new ImportRequest(dataToImport, this.fileName);

    if(dataToImport.filter((f) => f.prospectiveBudgetId == null).length > 0){
      this.alertMsg = "Não é possível importar lançamentos sem caracterização do orçamento."
      this.submitted = false;
      return;
    } else {
      this.launchService.import(importRequest, accountId).subscribe(
        () => {
          this.submitted = false;
          this.toastr.success(`Foram importados ${dataToImport.length} registros`);
          this.clear();
        },
        err => {
          console.log(err);
          this.alertMsg = err.error.title
        }
      );
    }
  }

  checkAllChecked(obj:ImportBank[]):boolean{
    return obj.length === obj.filter((f) => f.selectedToImport).length;
  }

  changeSelect(obj:ImportBank[]):void{
    let someChecked = obj.filter((f) => f.selectedToImport).length > 0;
    obj.forEach((f) => f.selectedToImport = !someChecked);
  }

  clear():void{
    this.importResponse = null;
    this.submitted = false;
  }
}
