import { Component, QueryList, ViewChildren } from "@angular/core";
import { BudgetService } from "../../services/budget.service";
import { launch } from "../../models/launch.interface";
import { LaunchService } from "../../services/launch.service";
import { BaseComponent } from "../../core/baseComponent/base";
import { NgbdSortableHeader, SortEvent } from "src/app/core/directives/sort/sortable.directive";
import { Observable } from "rxjs";
import { AppService } from "src/app/app.service";
import { Account } from "src/app/models/account.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Budget } from "src/app/models/budget.class";
import { LaunchModalComponent } from "./launch-modal/launch.modal.component";

@Component({
  selector: "app-launch",
  templateUrl: "./launch.component.html",
  styleUrls: ["./launch.component.css"],
  providers: [BudgetService, LaunchService],
})
export class LaunchComponent extends BaseComponent {
  selectedMonth:number;
  selectedYear:number;
  launchs: launch[] = [];
  accounts: Account[] = [];
  typeBudgets: Budget[] = [];
  searchText!: string;
  monthId: number = new Date().getMonth() + 1;
  titleForm!: string;
  launchs$: Observable<launch[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private budgetService: BudgetService,
    private appService: AppService,
    public launchService: LaunchService,
    private modalService: NgbModal,
  ) {
    super();
    this.getAccounts();
    this.launchs$ = launchService.launchs$;
    this.total$ = launchService.total$;
  }

  getAccounts() {
    this.accounts = this.appService.accounts;
  }

  getTypeBudgets() {
    this.appService.getYear().subscribe(r => this.selectedYear = r);
    this.appService.getMonth().subscribe(r => this.selectedMonth = r);
    this.budgetService.findAllByMonthAndYear(this.selectedMonth,this.selectedYear).subscribe((s) => (this.typeBudgets = s));
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

  public deleteLaunch(launch: launch): void {
    this.launchService.delete(launch.id).subscribe(() => {
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


  addLaunch2() {
    const modalRef = this.modalService.open(LaunchModalComponent,{ windowClass : "modal-pre-lg"});
    modalRef.componentInstance.title = "Criar Lançamento";
    modalRef.result.then(r => {
      if(r != 0) {
        this.launchService.getLaunchs();
      }
    });
  }

  editLaunch(launch: launch) {
    const modalRef = this.modalService.open(LaunchModalComponent,{ windowClass : "modal-pre-lg"});
    modalRef.componentInstance.title = `Editar Lançamento ${launch.description}`;
    modalRef.componentInstance.launch = launch;
    modalRef.result.then(r => {
      if(r != 0) {
        this.launchService.getLaunchs();
      }
    });
  }


  updateLaunch(formSend: launch) {
    this.launchService.update(formSend.id, formSend).subscribe(
      () => {
        this.launchService.getLaunchs();
        this.clearForm();
      },
      () => {}
    );
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


}


