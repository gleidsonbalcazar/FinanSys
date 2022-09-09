import { Component, Input, NgZone } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { budget } from "src/app/class/budget.interface";
import { BudgetWord } from "src/app/class/budgetWord.interface";
import { BudgetService } from "../budget.service";

@Component({
  selector: "app-budget-word",
  templateUrl: "./budgetWords.modal.component.html",
  styleUrls: ["./budgetWords.modal.component.css"],
})
export class BudgetWordsModalComponent {
  @Input() budget:budget;
  @Input() budgetWords:BudgetWord[];

  public formWord: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private budgetService: BudgetService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.createFormWord();
  }

  addNewWord(budgetId:number):void{
    var form = this.formWord.value;
    this.budgetService.addBudgetWord(form.word,budgetId).subscribe(
      (f) => {
        this.budgetWords.push(f);
        this.formWord.reset();
        this.toastr.success('Palavra adicionada');
      },
      (error) => {
        this.formWord.reset();
        this.toastr.error('Houve um erro na ação');
      }
    );
  }

  editWord(budgetWord: BudgetWord){
    budgetWord.editable=!budgetWord.editable;
  }

  saveEditWord(budgetWord:BudgetWord){
     this.budgetService.updateBudgetWord(budgetWord.id, budgetWord).subscribe(
      (f) => {
        budgetWord.editable=false;
        this.toastr.success('Palavra atualizada');
      },
      (error) => {
        this.toastr.error('Houve um erro na ação');
      }
    );
  }

  removeWord(word:any){
    this.budgetService.removeBudgetWord(word.id).subscribe(
      (f) => {
        let objToRemoveIndex = this.budgetWords.findIndex(s => s.id == f.id);
        this.budgetWords.splice(objToRemoveIndex,1);
        this.toastr.success('Palavra removida');
      },
      (error) => {
        this.toastr.error('Houve um erro na ação');
      }
    );
  }

  createFormWord() {
    this.formWord = this.formBuilder.group({
      word:[]
    });
  }


}
