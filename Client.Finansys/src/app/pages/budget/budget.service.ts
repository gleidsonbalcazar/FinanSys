import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BudgetWord } from 'src/app/class/budgetWord.interface';
import { budget } from '../../class/budget.interface';
import { CrudService } from '../../core/service/crud.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetService extends CrudService<budget, number> {
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {
    super(http, `${baseUrl}budgets`);
  }

  public addBudgetWord(word: string, budgetId: number): Observable<BudgetWord> {
    return this.http.post<BudgetWord>(this.baseUrl + 'budgets/addWord', {
      BudgetWord: word,
      BudgetId: budgetId,
    });
  }

  public removeBudgetWord(id:number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'budgets/removeWord/' + id);
  }

  public updateBudgetWord(id:number, budgetWord:BudgetWord): Observable<BudgetWord> {
    return this.http.put<BudgetWord>(this.baseUrl + 'budgets/updateWord/' + id, budgetWord, {});
  }
}
