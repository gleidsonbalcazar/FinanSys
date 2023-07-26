import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Account } from "./models/account.interface";
import { Months } from "./models/months.interface";

@Injectable()
export class AppService {

  public accounts: Account[] = [
    { id: 1, accountName: 'Conta Gleidson'},
    { id: 2, accountName: 'Poupança'},
    { id: 3, accountName: 'Conta Nathalie'},
    { id: 4, accountName: 'Conta N26'},
  ]
  public month = new BehaviorSubject<number>(new Date().getMonth() + 1);
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

  public year = new BehaviorSubject<number>(new Date().getFullYear());

  setMonth(value:number) {
    this.month.next(value);
  }

  getMonth():Observable<number>{
    return this.month.asObservable();
  }

  setYear(value:number) {
    this.year.next(value);
  }

  getYear():Observable<number>{
    return this.year.asObservable();
  }
}
