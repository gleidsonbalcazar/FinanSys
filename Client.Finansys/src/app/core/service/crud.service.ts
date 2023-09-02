
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CrudOperations } from '../../models/crud-operations';
import { Params } from '@angular/router';

export class CrudService<T, ID> implements CrudOperations<T, ID> {

  constructor(
    protected _http: HttpClient,
    protected _base: string,
  ) {}

  save(t: T): Observable<T> {
    return this._http.post<T>(this._base, t);
  }

  update(id: ID, t: T): Observable<T> {
    return this._http.put<T>(this._base + "/" + id, t, {});
  }

  findOne(id: ID): Observable<T> {
    return this._http.get<T>(this._base + "/" + id);
  }

  findAllById(id: ID): Observable<T[]> {
    return this._http.get<T[]>(this._base + "/" + id);
  }

  findAllByMonthAndYear(month: ID, year: ID, accountFilter: ID): Observable<T[]> {
    return this._http.get<T[]>(this._base + "/" + month + "/" + year + "/" + accountFilter);
  }

  findAllBudgetsByMonthAndYear(month: ID, year: ID): Observable<T[]> {
    return this._http.get<T[]>(this._base + "/" + month + "/" + year);
  }

  findAll(param: string): Observable<T[]> {
    if(param!=null){
      return this._http.get<T[]>(this._base + "?" + param)
    }
    return this._http.get<T[]>(this._base)
  }

  delete(id: ID): Observable<T> {
    return this._http.delete<T>(this._base + '/' + id);
	}

}
