import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Account } from "./class/account.interface";
import { Months } from "./class/months.interface";

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
