import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { AppService } from "../app.service";
import { Months } from "../models/months.interface";
import { LoginService } from "../services/login.service";

@Component({
  selector: "nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent implements OnInit{
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();
  public isExpanded = false;
  public isLogged:boolean = false;
  public monthId!: number;
  public year!: number;
  public user!:any;
  public months: Months[] = [
    { id: 0, name: "Todos", pref: "All" },
    { id: 1, name: "Janeiro", pref: "Jan" },
    { id: 2, name: "Fevereiro", pref: "Fev" },
    { id: 3, name: "Março", pref: "Mar" },
    { id: 4, name: "Abril", pref:"Abr" },
    { id: 5, name: "Maio", pref: "Mai" },
    { id: 6, name: "Junho", pref: "Jun" },
    { id: 7, name: "Julho", pref: "Jul" },
    { id: 8, name: "Agosto", pref: "Ago" },
    { id: 9, name: "Setembro", pref: "Set" },
    { id: 10, name: "Outubro", pref: "Out" },
    { id: 11, name: "Novembro", pref: "Nov" },
    { id: 12, name: "Dezembro", pref: "Dez" },
  ];
  public years: any[] = [
     '2019', '2020','2021','2022','2023','2024'
  ];

  constructor(
      public appService: AppService,
      public loginService: LoginService
  ) {

  }

  ngOnInit() {
   this.loadNavMenu();
  }

  public loadNavMenu(){
    this.appService.getMonth().subscribe((s) => {
      this.monthId = s;
      this.appService.getYear().subscribe(y => {
        this.year = y;
      })
    });

    this.loginService.isUserLogged().subscribe((s) => {
      this.user = this.loginService.currentUserValue;
      this.isLogged = s;
    })

    if(this.user){
      this.isLogged = true;
    }
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
    this.loginService.logout();
    window.location.reload();
  }
}
