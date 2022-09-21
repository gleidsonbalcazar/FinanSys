import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Months } from "src/app/class/months.interface";

@Component({
  template: "",
})
export abstract class BaseComponent implements OnInit {
  /*Variables*/
  myForm: FormGroup;
  submitted = false;

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

  constructor() {}

  ngOnInit() {}

  public get f() {
    return this.myForm.controls;
  }

  public clearForm(): void {
    this.myForm.reset();
  }
}
