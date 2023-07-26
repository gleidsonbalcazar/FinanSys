import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Months } from "src/app/models/months.interface";

@Component({
  template: "",
})
export abstract class BaseComponent implements OnInit {
  /*Variables*/
  myForm: FormGroup;
  submitted = false;

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

  constructor() {}

  ngOnInit() {}

  public get f() {
    return this.myForm.controls;
  }

  public clearForm(): void {
    this.myForm.reset();
  }
}
