import { Component, Inject } from "@angular/core";
import { budget } from "../../class/budget.interface";
import { BudgetService } from "./budget.service";
import { BaseComponent } from "../../core/baseComponent/base";
import { Account } from "src/app/class/account.interface";
import { BudgetWord } from "src/app/class/budgetWord.interface";
import { BudgetWordsModalComponent } from "./budgetWords/budgetWords.modal.component";
import { BudgetIndicatorsModalComponent } from "./budgetIndicators/budgetIndicators.modal.component";
import { BudgetManagerModalComponent } from "./budgetManager/budgetManager.modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BudgetConfig } from "src/app/class/budgetConfig.interface";

@Component({
  selector: "app-budget",
  templateUrl: "./budget.component.html",
  styleUrls: ["./budget.component.css"],
  providers: [BudgetService],
})
export class BudgetListComponent extends BaseComponent {
  public formWord: any;

  public budgets: budget[];
  public budgetWords: BudgetWord[];
  public searchText: string;
  public titleModalWords:string;
  public accounts: Account[];
  public budgetId:number = 4;
  public showAllFields:boolean = false;
  titleForm: string;

  constructor(
    @Inject("BASE_URL") private baseUrl: string,
    private budgetService: BudgetService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    super();
    this.getBudgets();
  }

  public showAll(){
    this.showAllFields = !this.showAllFields;
    this.budgetService.findAll(`allFields=${this.showAllFields}`).subscribe((result) => {
      this.budgets = result;
    });
  }

  public getBudgets(): void {
    this.budgetService.findAll(null).subscribe((result) => {
      this.budgets = result;
    });
  }

  public deleteBudget(budget: budget): void {
    this.budgetService.delete(budget.id).subscribe(
      (f) => {
        this.getBudgets();
      },
      (error) => {
      }
    );
  }

  public getMonth(budgetConfig: BudgetConfig[]) {
    if(budgetConfig==null)
      return "";

    let months = budgetConfig.map(m => m.month);

    let monthsDescArray = this.months.filter(f => months.includes(f.id)).map(m => m.pref);

    return monthsDescArray.join(", ");
  }

  async editBudget(budget: budget) {
    const modalRef = this.modalService.open(BudgetManagerModalComponent,{ windowClass : "modal-pre-lg"});
    modalRef.componentInstance.title = `Editar Orçamento ${budget.description}`;
    modalRef.componentInstance.budget = budget;
    modalRef.result.then(r => { if(r != 0) {this.getBudgets();}});
  }

  async addBudget() {
    const modalRef = this.modalService.open(BudgetManagerModalComponent,{ windowClass : "modal-pre-lg"});
    modalRef.componentInstance.title = "Novo Orçamento";
    modalRef.result.then(r => { if(r != 0) {this.budgets.push(r)}});
  }

  async getBudgetWords(budget:budget){
    const modalRef = this.modalService.open(BudgetWordsModalComponent,{ windowClass : "modal-pre-lg"});
    modalRef.componentInstance.budget = budget;
    modalRef.componentInstance.budgetWords = budget.budgetWords?.map( el => el = {...el, editable: false});
  }

  async openIndicator(txt:string) {
    const modalRef = this.modalService.open(BudgetIndicatorsModalComponent,{ windowClass : "modal-pre-lg"});
    modalRef.componentInstance.budgets = this.budgets;
  }

  public updateStatus(budget:budget){
    budget.active = !budget.active;
    this.budgetService.update(budget.id, budget).subscribe(
      (f) => {
        this.toastr.success('Orçamento atualizado com sucesso');
      },
      (error) => {
        this.toastr.error('Houve um erro na ação');
      }
    );
  }

}
