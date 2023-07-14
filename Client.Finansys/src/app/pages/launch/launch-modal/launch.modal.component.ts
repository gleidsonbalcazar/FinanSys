import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AppService } from "src/app/app.service";
import { BaseComponent } from "src/app/core/baseComponent/base";
import { BudgetService } from "../../budget/budget.service";
import { Budget } from "src/app/class/budget.class";
import { Account } from "src/app/class/account.interface";
import { FormBuilder, Validators } from "@angular/forms";
import { LaunchService } from "../launch.service";
import { launch } from "src/app/class/launch.interface";
import { ConfirmDialogService } from "src/app/core/modal/confirm/confirm-dialog.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-launch-modal",
  templateUrl: "./launch.modal.component.html",
  styleUrls: ["./launch.modal.component.css"],
})
export class LaunchModalComponent extends BaseComponent{
  @Input() title:string;
  @Input() launch:launch;
  @Input() budgetToLaunch:any;

  selectedMonth:number;
  selectedYear:number;
  typeBudgets: Budget[] = [];
  accounts: Account[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private toastr: ToastrService,
    private budgetService: BudgetService,
    public launchService: LaunchService,
    private confirmDialogService: ConfirmDialogService,
  ) {
    super()
  }

  override ngOnInit() {
    this.getTypeBudgets();
    this.getAccounts();
    this.createForm();

    if (this.budgetToLaunch != null) {
      let budget = this.budgetToLaunch;
      this.launch = {
        id: null,
        budget: null,
        account: null,
        description: budget.description,
        budgetId: budget.id,
        accountId: 1,
        day: new Date(),
        valuePrev: budget.valueOrc,
        valueExec:0,
        typeLaunch: budget.typeBudget,
        active: true,
      };

      this.loadForm(this.launch);
    }

    if(this.launch?.id > 0){
      this.loadForm(this.launch);
    }
  }

  loadForm(launch:any):void {
    this.myForm.patchValue(launch);
    let dayForm  = this.myForm.get('day');
    dayForm.patchValue(this.formatDate(new Date()));
  }



  getTypeBudgets() {
    this.appService.getYear().subscribe(r => this.selectedYear = r);
    this.appService.getMonth().subscribe(r => this.selectedMonth = r);
    this.budgetService.findAllByMonthAndYear(this.selectedMonth,this.selectedYear).subscribe((s) => (this.typeBudgets = s));
  }

  getAccounts() {
    this.accounts = this.appService.accounts;
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.save();
    }
  }

  createForm() {
    this.myForm = this.formBuilder.group({
      id: [null],
      description: [{ value: "", disabled: false }, Validators.required],
      budgetId: [null, Validators.required],
      budget:[],
      account:[],
      accountId: [1, Validators.required],
      day: [new Date(), Validators.required],
      valuePrev: [{ value: 0, disabled: false }, Validators.required],
      valueExec: [{ value: 0, disabled: false }, Validators.required],
      typeLaunch: [null, Validators.required],
      userCreated: ["Admin"],
      dateCreated: [new Date()],
      active: [true],
    });
    let dayForm  = this.myForm.get('day');
    dayForm.patchValue(this.formatDate(new Date()));
  }


  submitForm(formSend:any,nextBe:boolean) {
    if (formSend.id === null) {
      this.createLaunch(formSend);
    } else {
      this.updateLaunch(formSend);
    }
    this.resetForm();
    // if(!nextBe){
    //   this.activeModal.close();
    // }
  }

  createLaunch(formSend: launch) {
    this.launchService.save(formSend).subscribe(
      (f) => {
        this.toastr.success('Lançamento criado com sucesso');
        this.clearForm();
        this.activeModal.close(f);
      },
      (error) => {
        this.toastr.error('Houve um erro na ação');
      });
  }

  updateLaunch(formSend: launch) {
    this.launchService.update(formSend.id, formSend).subscribe(
      (f) => {
        this.toastr.success('Lançamento atualizado com sucesso');
        this.clearForm();
        this.activeModal.close(f);
      },
      (error) => {
        this.toastr.error('Houve um erro na ação');
      });
  }

  resetForm():void{
    this.myForm.reset();
    this.createForm();
  }

  private formatDate(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  save(nextBe:boolean = false) {
    this.submitted = true;
    if (this.myForm.invalid) {
         return;
    }
    var formSend = <launch>this.myForm.value;
    this.submitForm(formSend,nextBe);
    // this.launchService.checkDuplicate(formSend).subscribe((f) => {
    //   let that = this;
    //   if (f) {
    //     this.confirmDialogService.confirmThis(
    //       "É possível já ter efetuado este lançamento, tem certeza que deseja continuar?",
    //       function () {
    //        that.submitForm(formSend,nextBe);
    //       },
    //       function () {}
    //     );
    //   }else {
    //     that.submitForm(formSend,nextBe);
    //   }
    // });
  }


}
