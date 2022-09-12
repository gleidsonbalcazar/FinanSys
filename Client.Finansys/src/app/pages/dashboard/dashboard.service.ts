import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from 'src/app/class/account.interface';
import { home } from '../../class/home.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string,
  ) {
   }

   public getPainel(month:number, year:number): Observable<home[]>{
     return this.http.get<home[]>(this.baseUrl + 'home' + '/' + month +"/"+year);
   }

   public getPainelResume(month:number, year:number): Observable<any>{
    return this.http.get<home[]>(this.baseUrl + 'home' + '/resume/' + month + "/" +year);
  }

  public getAccounts(): Observable<Account[]>{
    return this.http.get<Account[]>(this.baseUrl + 'accounts');
  }

}
