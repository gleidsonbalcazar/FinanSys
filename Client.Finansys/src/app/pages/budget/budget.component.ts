import { Component, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { budget } from "../../class/budget.interface";
import { BudgetService } from "./budget.service";
import { BaseComponent } from "../../core/baseComponent/base";
import { Account } from "src/app/class/account.interface";
import { BudgetWord } from "src/app/class/budgetWord.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BudgetWordsModalComponent } from "./budgetWords/budgetWords.modal.component";
import { BudgetIndicatorsModalComponent } from "./budgetIndicators/budgetIndicators.modal.component";
import { BudgetManagerModalComponent } from "./budgetManager/budgetManager.modal.component";

@Component({
  selector: "app-budget",
  templateUrl: "./budget.component.html",
  styleUrls: ["./budget.component.css"],
  providers: [BudgetService],
})
export class BudgetListComponent extends BaseComponent {
  public formWord: FormGroup;

  public budgets: budget[];
  public budgetWords: BudgetWord[];
  public searchText: string;
  public titleModalWords:string;
  public accounts: Account[];
  public budgetId:number = 4;
  titleForm: string;

  constructor(
    @Inject("BASE_URL") private baseUrl: string,
    private budgetService: BudgetService,
    private modalService: NgbModal
  ) {
    super();
    this.getBudgets();
  }

  public getBudgets(): void {
    this.budgetService.findAll().subscribe((s) => {
      this.budgets = s.map(m => m = {...m, default: m.default===null?false:true});
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

  public getMonthById(id: number) {
    return this.months.find((f) => f.id === id).name;
  }

  async editBudget(budget: budget) {
    const modalRef = this.modalService.open(BudgetManagerModalComponent,{ windowClass : "modal-pre-lg"});
    modalRef.componentInstance.title = `Editar Orçamento ${budget.description}`;
    modalRef.componentInstance.budget = budget;
    modalRef.result.then(r => { if(r != 0) {this.budgets.push(r)}});
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




}
