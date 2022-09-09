import { HttpClient } from "@angular/common/http";
import { Component, Inject, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BudgetService } from "../budget/budget.service";
import { budget } from "../../class/budget.interface";
import { launch } from "../../class/launch.interface";
import * as moment from "moment";
import { LaunchService } from "./launch.service";
import { ModalComponent } from "../../core/modal/modal.component";
import { ModalConfig } from "../../core/modal/modal.config";
import { Months } from "../../class/months.interface";
import { BaseComponent } from "../../core/baseComponent/base";
import { NgbdSortableHeader, SortEvent } from "src/app/core/directives/sort/sortable.directive";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { ConfirmDialogService } from "src/app/core/modal/confirm/confirm-dialog.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Account } from "src/app/class/account.interface";

@Component({
  selector: "app-launch",
  templateUrl: "./launch.component.html",
  styleUrls: ["./launch.component.css"],
  providers: [BudgetService, LaunchService],
})
export class LaunchComponent extends BaseComponent {
  public launchs: launch[] = [];
  public accounts: Account[] = [];
  public typeBudgets: budget[] = [];
  public searchText!: string;
  public monthId: number = new Date().getMonth() + 1;
  titleForm!: string;
  launchs$: Observable<launch[]>;
  total$: Observable<number>;
  @ViewChild("modal")
  private modal!: ModalComponent;

  @ViewChildren(NgbdSortableHeader)
  headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private budgetService: BudgetService,
    private appService: AppService,
    public launchService: LaunchService,
    private confirmDialogService: ConfirmDialogService,
    private modalService: NgbModal,
    private router: Router,
    @Inject("BASE_URL") private baseUrl: string
  ) {
    super();
    this.getAccounts();
    this.getTypeBudgets();
    this.createForm();
    this.launchs$ = launchService.launchs$;
    this.total$ = launchService.total$;
  }

  getAccounts() {
    this.accounts = this.appService.accounts;
  }

  getTypeBudgets() {
    this.budgetService.findAll().subscribe((s) => (this.typeBudgets = s));
  }

  getAccountNameIcon(id: number) {
    switch (id) {
      case 1:
        return "G";
        break;
      case 2:
        return "P";
        break;
      case 3:
        return "N";
        break;
      case 4:
        return "N26";
        break;
      default:
        return "---";
        break;
    }
  }

  save(nextBe:boolean = false) {
    this.submitted = true;
    if (this.myForm.invalid) {
         return;
    }
    var formSend = <launch>this.myForm.value;
    this.launchService.checkDuplicate(formSend).subscribe((f) => {
      let that = this;
      if (f) {
        this.confirmDialogService.confirmThis(
          "É possível já ter efetuado este lançamento, tem certeza que deseja continuar?",
          function () {
           that.submitForm(formSend,nextBe);
          },
          function () {}
        );
      }else {
        that.submitForm(formSend,nextBe);
      }
    });
  }

  import():void{
    this.router.navigate(['launch','import']);
  }

  public modalConfig: ModalConfig = {
    modalTitle: "",
    hideDismissButton: () => true,
    saveButtonLabel: "Salvar",
    onClose: () => {
      return true;
    },
    closeButtonLabel: "Fechar",
  };

  submitForm(formSend:any,nextBe:boolean) {
    if (formSend.id === null) {
      this.createLaunch(formSend);
    } else {
      this.updateLaunch(formSend);
    }
    this.resetForm();
    if(!nextBe){
      this.modalService.dismissAll();
    }
  }

  resetForm():void{
    this.myForm.reset();
    this.createForm();
  }

  public deleteLaunch(launch: launch): void {
    this.launchService.delete(launch.id).subscribe((f) => {
      this.launchService.getLaunchs();
    });
  }

  getTotalExpensesPrev() {
    let total = 0;
    this.launchs$.subscribe((s) => {
      total = s.filter((s) => s.typeLaunch == "R").reduce((s, c) => s + c.valuePrev, 0) - s.filter((s) => s.typeLaunch == "D").reduce((s, c) => s + c.valuePrev, 0);
    });
    return total;
  }

  getTotalExpensesExec() {
    let total = 0;
    this.launchs$.subscribe((s) => {
      total = s.filter((s) => s.typeLaunch == "R").reduce((s, c) => s + c.valueExec, 0) - s.filter((s) => s.typeLaunch == "D").reduce((s, c) => s + c.valueExec, 0);
    });
    return total;
  }

  executePrev(launch: launch): void {
    launch.valueExec = launch.valuePrev;
    launch.day = new Date();
    launch.valuePrev = 0.0;
    this.updateLaunch(launch);
  }

  async editLaunch(launch: launch) {
    this.modal.modalConfig.modalTitle = `Editar Lançamento ${launch.description}`;
    this.myForm.patchValue({
      id: launch.id,
      description: launch.description,
      budgetId: launch.budgetId,
      accountId: launch.accountId,
      day: moment(launch.day).format("YYYY-MM-DD"),
      valuePrev: launch.valuePrev,
      valueExec: launch.valueExec,
      typeLaunch: launch.typeLaunch,
      active: launch.active,
    });
    return await this.modal.open("");
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

  updateLaunch(formSend: launch) {
    this.launchService.update(formSend.id, formSend).subscribe(
      (f) => {
        this.launchService.getLaunchs();
        this.clearForm();
      },
      (error) => {}
    );
  }

  createLaunch(formSend: launch) {
    this.launchService.save(formSend).subscribe((f) => {
      this.launchService.getLaunchs();
      this.clearForm();
    });
  }

  async addLaunch() {
    this.modal.modalConfig.modalTitle = "Criar Lançamento";
    this.myForm.reset();
    this.createForm();
    return await this.modal.open("");
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.modal.save();
    }
  }

  createForm() {
    this.myForm = this.formBuilder.group({
      id: [null],
      description: [{ value: "", disabled: false }, Validators.required],
      budgetId: [null, Validators.required],
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

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.launchService.sortColumn = column;
    this.launchService.sortDirection = direction;
  }

  // confirmDuplicateModal(formSend: launch){
  //     this.confirmDialogService.confirmThis("Are you sure to delete?", function () {
  //       alert("Yes clicked");
  //     }, function () {
  //       alert("No clicked");
  //     })
  //     if (formSend.id === null) {
  //       //this.createLaunch(formSend);
  //     } else {
  //       //this.updateLaunch(formSend);
  //     }

  // }
}


