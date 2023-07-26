import { Observable } from 'rxjs';


export interface CrudOperations<T, ID> {
	save(t: T): Observable<T>;
	update(id: ID, t: T): Observable<T>;
	findOne(id: ID): Observable<T>;
	findAll(param:any): Observable<T[]>;
	delete(id: ID): Observable<any>;
}
