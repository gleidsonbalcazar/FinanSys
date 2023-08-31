import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { IndicatorsService } from '../../../../services/indicators.service';
import { Budget } from 'src/app/models/budget.class';

@Component({
  selector: 'app-budget-indicators',
  templateUrl: './budgetIndicators.modal.component.html',
  styleUrls: ['./budgetIndicators.modal.component.css'],
})
export class BudgetIndicatorsModalComponent {
  @Input() budgetId: number = 4;
  @Input() budgets: Budget[];

  public averageExecValue: number;
  public averageOrcValue: number;
  public lineChartData: ChartDataSets[] = [];
  public chartOptions = { responsive: true };
  public lineChartLabels: Label[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private indicatorService: IndicatorsService
  ) {}

  ngOnInit() {
    this.getBudgetIndicator(this.budgetId);
  }

  getBudgetIndicator(budgetId: number) {
    this.indicatorService.getBudgetIndicator(budgetId).subscribe((s) => {
      this.lineChartData = s.map((s) => ({
        label: s.label,
        data: s.data.map((d) => d.value),
      }));

      this.averageExecValue = s[0].averageValue;
      this.averageOrcValue = s[1].averageValue;

      this.lineChartLabels = s[0].data.map((s) => s.monthDesc);
    });
  }

  changeBudget(id: number) {
    this.budgetId = id;
    this.getBudgetIndicator(id);
  }

  public lineChartOptions: ChartOptions & { annotation: any } = {
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
          },
        },
      ],
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
            content: 'LineAnno',
          },
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
}
