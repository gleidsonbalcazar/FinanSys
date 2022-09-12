import { Component, Input } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { budget } from "src/app/class/budget.interface";
import { BaseComponent } from "src/app/core/baseComponent/base";
import { BudgetService } from "../budget.service";

@Component({
  selector: "app-budget-manager",
  templateUrl: "./budgetManager.modal.component.html",
  styleUrls: ["./budgetManager.modal.component.css"],
})
export class BudgetManagerModalComponent extends BaseComponent{

  @Input() budget:budget;
  @Input() title:string;

  constructor(
    public activeModal: NgbActiveModal,
    private budgetService: BudgetService,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
  ) {
    super();
  }

  override ngOnInit() {
    this.createForm();
    if(this.budget?.id>0){
      this.myForm.setValue(this.budget);
    }
  }

  onMonthChangeSelect(month:number){
    if(month > 0){
      this.myForm.controls['default'].setValue(false);
      this.myForm.controls['default'].disable();
    } else {
      this.myForm.controls['default'].enable();
    }
  }

  createForm() {
    this.myForm = this.formBuilder.group({
      id: [null],
      description: [null, Validators.required],
      value: [0, Validators.required],
      month: [0, Validators.required],
      typeBudget: [null, Validators.required],
      active: [true],
      userCreated: ['Admin'],
      dateCreated: [new Date()],
      default: false,
      budgetWords:[]
    });
  }

  submitForm(): void {
    var formSend = <budget>this.myForm.value;
    if (formSend.id === null) {
      this.createBudget(formSend);
    } else {
      this.updateBudget(formSend);
    }
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
