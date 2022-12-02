import { Component, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { budget } from "src/app/class/budget.interface";
import { BudgetConfig } from "src/app/class/budgetConfig.interface";
import { BaseComponent } from "src/app/core/baseComponent/base";
import { DropdownMultiselectInterface } from "src/app/core/dropdown-multiselect/dropdown-multiselect.interface";
import { BudgetService } from "../budget.service";

@Component({
  selector: "app-budget-manager",
  templateUrl: "./budgetManager.modal.component.html",
  styleUrls: ["./budgetManager.modal.component.css"],
})
export class BudgetManagerModalComponent extends BaseComponent{

  @Input() budget:budget;
  @Input() title:string;
  monthsList:DropdownMultiselectInterface[] = [];
  budgetConfig:BudgetConfig[] = [];
  budgetIdSelected:number[];

  constructor(
    public activeModal: NgbActiveModal,
    private budgetService: BudgetService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {
    super();
  }

  override ngOnInit() {
    this.createForm();
    if(this.budget?.id>0){
      this.myForm.setValue(this.budget);
      this.budgetIdSelected  =this.budget.budgetConfig.map(m => m.month);
      this.monthsList.filter(f =>  this.budgetIdSelected.includes(f._id)).forEach(e => e.checked = true);
    }
  }

  createForm() {
    this.myForm = this.formBuilder.group({
      id: [null],
      description: [null, Validators.required],
      value: [0, Validators.required],
      budgetConfig: [null],
      budgetWords: [null],
      typeBudget: [null, Validators.required],
      active: [true],
      userCreated: ['Web'],
      default: null,
      dateCreated: [new Date()]
    });

    this.monthsList = [
      { _id: 1, label: 'Janeiro', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 2, label: 'Fevereiro', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 3, label: 'Março', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 4, label: 'Abril', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 5, label: 'Maio', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 6, label: 'Junho', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 7, label: 'Julho', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 8, label: 'Agosto', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 9, label: 'Setembro', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 10, label: 'Outubro', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 11, label: 'Novembro', badgeLabel: '0', color: 'badge-light-green', checked: false},
      { _id: 12, label: 'Dezembro', badgeLabel: '0', color: 'badge-light-green', checked: false},
    ];
  }

  selectMonth(ev){
    this.budgetIdSelected = ev.status;
  }

  submitForm(): void {
    this.loadBudgetConfigOnForm();
    var formSend = <budget>this.myForm.value;
    if (formSend.id === null) {
      this.createBudget(formSend);
    } else {
      this.updateBudget(formSend);
    }
  }

  loadBudgetConfigOnForm() {
    for (let index = 0; index < this.budgetIdSelected.length; index++) {
       let value:number = Number(this.budgetIdSelected[index]);
       var budgetConf:BudgetConfig = { month: value, year: new Date().getFullYear(), active: true};
       this.budgetConfig.push(budgetConf);
    }

    this.myForm.controls['budgetConfig'].patchValue(this.budgetConfig);
  }


  updateBudget(formSend: budget) {
    this.budgetService.update(formSend.id, formSend).subscribe(
      (f) => {
        this.clearForm();
        this.toastr.success('Orçamento atualizado com sucesso');
        this.activeModal.close(f);
      },
      (error) => {
        this.toastr.error('Houve um erro na ação');
      }
    );
  }

  createBudget(formSend: budget) {
    this.budgetService.save(formSend).subscribe(
      (f) => {
        this.toastr.success('Orçamento criado com sucesso');
        this.clearForm();
        this.activeModal.close(f);
      },
      (error) => {
        this.toastr.error('Houve um erro na ação');
      }
    );
  }
}
