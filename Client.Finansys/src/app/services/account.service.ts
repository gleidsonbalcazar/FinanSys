import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../core/service/crud.service';
import { Account } from '../models/account.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends CrudService<Account, number> {
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {
    super(http, `${baseUrl}Accounts`);
  }

  public getAccountByUser(id:number): Observable<Account[]>{
    return this.http.get<Account[]>(this.baseUrl + 'Accounts/user' + '/' + id);
  }

  public getAllAccountsWithDetail(month:number): Observable<Account[]>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append('month', month);
    return this.http.get<Account[]>(this.baseUrl + 'Accounts/GetAllAccountsWithDetail', {params: queryParams});
  }

}
