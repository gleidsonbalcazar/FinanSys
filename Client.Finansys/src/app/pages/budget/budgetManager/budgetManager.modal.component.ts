import { Component, HostListener, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Budget } from "src/app/models/budget.class";
import { BudgetConfig } from "src/app/models/budgetConfig.interface";
import { BaseComponent } from "src/app/core/baseComponent/base";
import { BudgetService } from "../../../services/budget.service";
import { ViewportScroller } from "@angular/common";

@Component({
  selector: "app-budget-manager",
  templateUrl: "./budgetManager.modal.component.html",
  styleUrls: ["./budgetManager.modal.component.css"],
})
export class BudgetManagerModalComponent extends BaseComponent{
  @HostListener('window:scroll')

  formDetails: FormGroup;
  formConfig: FormGroup;
  @Input() budget:Budget;
  @Input() title:string;

  budgetConfig:BudgetConfig[] = [];
  monthsList: any[];
  yearsList: any[];
  configAction: string = 'ADD';
  pageYoffset: number;


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
    if(this.budget?.id > 0){
      this.budget.budgetConfig = this.budget.budgetConfig.sort((a,b) => { return b.year - a.year ||a.month - b.month})
      this.formDetails.setValue(this.budget);
    } else {
      this.createBudgetObject();
    }
  }


  createBudgetObject():void {
    this.budget = new Budget({ budgetConfig: [], budgetWords:[]});
  }

  addMonthYear(){
    let yearValue = this.formConfig.controls['yearValue'].value;
    let monthValue = this.formConfig.controls['monthValue'].value;
    let inputValue = this.formConfig.controls['value'].value;

    if(yearValue == null || monthValue == null || inputValue == null){
      this.toastr.warning('É necessário preencher o Ano/Mês/Valor para adicionar uma configuração');
      return;
    }

    let budgetExists = this.budget.budgetConfig.find(f => f.month == monthValue && f.year == yearValue);
    if(budgetExists != null && this.configAction == 'ADD'){
      this.toastr.warning('Não é possível adicionar a configuração para um mês/ano já existente.');
      return;
    }


    if(monthValue > 12 && this.configAction == 'ADD'){
      for (let month_index = 1; month_index <= 12; month_index++) {
        var budgetConf:BudgetConfig = { id: null, budgetId: this.budget?.id??0 ,month: +month_index, year: +yearValue, active: true, value: inputValue};
        this.budget.budgetConfig.push(budgetConf);
      }
    } else {
      var budgetConf:BudgetConfig = { id: null, budgetId: this.budget?.id??0 ,month: +monthValue, year: +yearValue, active: true, value: inputValue};
      this.budget.budgetConfig.push(budgetConf);
    }


    this.formDetails.controls['budgetConfig'].patchValue(this.budget.budgetConfig);

    this.clearConfigForm();

  }

  clearConfigForm() {
    this.formConfig.reset();
  }

  override clearForm(): void {
    this.formDetails.reset();
  }

  editBudgetConfig(config:any){
    this.formConfig.controls['monthValue'].setValue(config.month);
    this.formConfig.controls['yearValue'].setValue(config.year);
    this.formConfig.controls['value'].setValue(config.value);
    this.configAction = 'EDIT';
    let el = document.getElementById('value');
    el.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  updateMonthYear(){
    let yearValue = this.formConfig.controls['yearValue'].value;
    let monthValue = this.formConfig.controls['monthValue'].value;
    let budgetExists = this.budget.budgetConfig.find(f => f.month == monthValue && f.year == yearValue);
    this.removeBudgetConfig(budgetExists);
    this.addMonthYear();
    this.configAction = 'ADD';

  }

  removeBudgetConfig(config:any){
    let index = this.budget.budgetConfig.findIndex(f => f == config);
    this.budget.budgetConfig.splice(index,1);
  }

  createForm() {
    this.formDetails = this.formBuilder.group({
      id: [null],
      description: [null, Validators.required],
      budgetConfig: [null],
      budgetWords: [null],
      value: null,
      typeBudget: [null, Validators.required],
      active: [true],
      userCreated: ['Web'],
      default: null,
      dateCreated: [new Date()],
    });

    this.formConfig = this.formBuilder.group({
      value:[],
      yearValue:null,
      monthValue:null,
    });

    this.monthsList = [
      { id: null, label: 'Selecione o Mês'},
      { id: 1, label: 'Janeiro'},
      { id: 2, label: 'Fevereiro'},
      { id: 3, label: 'Março'},
      { id: 4, label: 'Abril'},
      { id: 5, label: 'Maio'},
      { id: 6, label: 'Junho'},
      { id: 7, label: 'Julho'},
      { id: 8, label: 'Agosto'},
      { id: 9, label: 'Setembro'},
      { id: 10, label: 'Outubro'},
      { id: 11, label: 'Novembro'},
      { id: 12, label: 'Dezembro'},
      { id: 999, label: '- TODOS -'},
    ];

    this.yearsList = [
      { id: null, label: 'Selecione o Ano'},
      { id: 2024, label: '2024'},
      { id: 2023, label: '2023'},
      { id: 2022, label: '2022'},
      { id: 2021, label: '2021'},
      { id: 2020, label: '2020'},
      { id: 2019, label: '2019'},
      { id: 2018, label: '2018'},
    ];
  }

  getMonthDescription(id:number):string{
    let monthObj = this.monthsList.find(f => f.id == id);
    return monthObj.label;
  }


  submitForm(): void {
    var formSend = this.formDetails.value;
    if (formSend.id === null) {
      this.createBudget(formSend);
    } else {
      this.updateBudget(formSend);
    }
  }


  updateBudget(formSend: Budget) {
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

  createBudget(formSend: Budget) {

    if(formSend.budgetConfig == null){
      this.toastr.warning('É necessário ter uma configuração de Ano/Mês/Valor para este orçamento');
      return;
    }

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
