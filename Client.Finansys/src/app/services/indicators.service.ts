import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BudgetIndicator } from 'src/app/models/budgetIndicator.interface';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string,
  ) {
   }

   public getBudgetIndicator(id:number): Observable<BudgetIndicator[]>{
    return this.http.get<BudgetIndicator[]>(this.baseUrl + 'indicators' + '/' + id);
  }

}
