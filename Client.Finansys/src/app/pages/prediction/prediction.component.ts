import { Component, Inject, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { budget } from "../../class/budget.interface";
import { Months } from "../../class/months.interface";
import { ModalComponent } from "../../core/modal/modal.component";
import { ModalConfig } from "../../core/modal/modal.config";
import { BaseComponent } from "../../core/baseComponent/base";
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { IndicatorsService } from "../indicators/indicators.service";
import { PredictionService } from "./prediction.service";

@Component({
  selector: "app-prediction",
  templateUrl: "./prediction.component.html",
  styleUrls: ["./prediction.component.css"],
  providers: [PredictionService],
})
export class PredictionListComponent extends BaseComponent {
  public budgets: budget[];
  public searchText: string;
  public submitted = false;
  public budgetId:number = 4;
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public months: Months[] = [
    { id: 0, name: "Todos" },
    { id: 1, name: "Janeiro" },
    { id: 2, name: "Fevereiro" },
    { id: 3, name: "Março" },
    { id: 4, name: "Abril" },
    { id: 5, name: "Maio" },
    { id: 6, name: "Junho" },
    { id: 7, name: "Julho" },
    { id: 8, name: "Agosto" },
    { id: 9, name: "Setembro" },
    { id: 10, name: "Outubro" },
    { id: 11, name: "Novembro" },
    { id: 12, name: "Dezembro" },
  ];
  titleForm: string;
  @ViewChild("modal") private modal: ModalComponent;
  @ViewChild("modalIndicator") private modalIndicator: ModalComponent;

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string,
    private formBuilder: FormBuilder,
    private budgetService: PredictionService,
    private indicatorService: IndicatorsService,
  ) {
    super();
    this.getPredictions();
    this.createForm();
  }

  public getPredictions(): void {
    this.budgetService.findAll().subscribe((s) => {
      //this.budgets = s;
    });
  }

  public modalConfig: ModalConfig = {
    modalTitle: null,
    hideDismissButton: () => true,
    onSave: () => {
      this.submitted = true;
      if (this.myForm.invalid) {
        return;
      }
      this.submitForm();
      return true;
    },
    saveButtonLabel: "Salvar",

    onClose: () => {
      return true;
    },
    closeButtonLabel: "Fechar",
  };

  public deletePrediction(budget: budget): void {
    this.budgetService.delete(budget.id).subscribe(
      (f) => {
        this.getPredictions();
      },
      (error) => {
      }
    );
  }

  async editPrediction(budget: budget) {
    this.modal.modalConfig.modalTitle = `Editar Orçamento ${budget.description}`;
    this.myForm.setValue(budget);
    return await this.modal.open("");
  }

  submitForm(): void {
    var formSend = <budget>this.myForm.value;
    if (formSend.id === null) {
      this.createPrediction(formSend);
    } else {
      this.updatePrediction(formSend);
    }
  }

  updatePrediction(formSend: budget) {
    // this.budgetService.update(formSend.id, formSend).subscribe(
    //   (f) => {
    //     this.getPredictions();
    //     this.clearForm();
    //   },
    //   (error) => {
    //   }
    // );
  }

  createPrediction(formSend: budget) {
    // this.budgetService.save(formSend).subscribe(
    //   (f) => {
    //     this.getPredictions();
    //     this.clearForm();
    //   },
    //   (error) => {
    //   }
    // );
  }

  onMonthChangeSelect(month:number){
    if(month > 0){
      this.myForm.controls['default'].setValue(false);
      this.myForm.controls['default'].disable();
    } else {
      this.myForm.controls['default'].enable();
    }
  }

  public getMonthById(id: number) {
    return this.months.find((f) => f.id === id).name;
  }

  async addPrediction() {
    this.modal.modalConfig.modalTitle = "Criar Orçamento";
    this.myForm.reset();
    this.createForm();
    return await this.modal.open("");
  }


  async openIndicator(txt:string) {
    this.modalIndicator.modalConfig.modalTitle = txt;
    this.modalIndicator.modalConfig.hideSaveButton= () =>true;
    this.getPredictions();
    this.getPredictionIndicator(this.budgetId);
    return await this.modalIndicator.open("modal-pre-lg");
  }



  createForm() {
    this.myForm = this.formBuilder.group({
      id: [null],
      description: [null, Validators.required],
      value: [0, Validators.required],
      month: [0, Validators.required],
      typePrediction: [null, Validators.required],
      active: [true],
      userCreated: ['Admin'],
      dateCreated: [new Date()],
      default: []
    });
  }

  changePrediction(id:number){
    this.budgetId = id;
    this.getPredictionIndicator(id);
  }

  getPredictionIndicator(budgetId: number) {
    // this.indicatorService.getPredictionIndicator(budgetId).subscribe(s => {
    //   console.log(s);
    //   this.lineChartData = s.map( s =>
    //     ({label: s.label, data: s.data.map(d => (d.value))})
    //   );

    //   this.lineChartLabels = s[0].data.map(s => s.monthDesc);
    // });
  }

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
}
