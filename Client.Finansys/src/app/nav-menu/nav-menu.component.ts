import { Component, Input, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { AppService } from "../app.service";
import { Months } from "../class/months.interface";
import { user } from "../class/user.interface";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent {
  @Input() user!: user;
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();
  isExpanded = false;
  public monthId!: number;
  public year!: number;
  public months: Months[] = [
    { id: 0, name: "Todos os Meses" },
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
  public years: any[] = [
     '2019', '2020','2021','2022','2023','2024'
  ];

  constructor(public appService: AppService) {
    this.appService.getMonth().subscribe((s) => {
      this.monthId = s;
      this.appService.getYear().subscribe(y => {
        this.year = y;
      })
    });
  }
  collapse() {
    this.isExpanded = false;
  }

  changeMonth(value: number): void {
    this.appService.setMonth(value);
  }

  changeYear(value: number): void {
    this.appService.setYear(value);
  }


  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  public logout() {
    this.logoutEvent.emit(null);
  }
}
