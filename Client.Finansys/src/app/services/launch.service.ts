import { DecimalPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PipeTransform } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { tap, debounceTime, switchMap, delay } from "rxjs/operators";
import { AppService } from "src/app/app.service";
import { ImportRequest } from "src/app/models/importRequest.class";
import { SearchResult } from "src/app/models/searchresult.interface";
import { State } from "src/app/models/state.interface";
import {
  SortColumn,
  SortDirection,
} from "src/app/core/directives/sort/sortable.directive";
import { launch } from "../models/launch.interface";
import { CrudService } from "../core/service/crud.service";

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  entity: any,
  column: SortColumn,
  direction: string
): any {
  if (direction === "" || column === "") {
    return entity;
  } else {
    return [...entity].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === "asc" ? res : -res;
    });
  }
}

function matchesLaunch(entity: launch, term: string, pipe: PipeTransform) {
  return (
    entity.description.toLowerCase().includes(term.toLowerCase()) ||
    entity.budget.description.toLowerCase().includes(term.toLowerCase()) ||
    pipe.transform(entity.valueExec).includes(term) ||
    pipe.transform(entity.valuePrev).includes(term)
  );
}

@Injectable({
  providedIn: "root",
})
export class LaunchService extends CrudService<launch, number> {
  public launchs: launch[] = [];
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _launchs$ = new BehaviorSubject<launch[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  public monthId!: number;
  public year!: number;
  public accountFilter:number = 0;
  private _state: State = {
    page: 1,
    pageSize: 25,
    searchTerm: "",
    sortColumn: "",
    sortDirection: "",
  };

  constructor(
    private http: HttpClient,
    private appService: AppService,
    @Inject("BASE_URL") private baseUrl: string,
    private pipe: DecimalPipe
  ) {
    super(http, `${baseUrl}launchs`);
    this.appService.getMonth().subscribe( s => {
      this.monthId = s;
      this.appService.getYear().subscribe(y => {
        this.year = y;
        this.appService.getAccountFilter().subscribe(ac=> {
          this.accountFilter = ac;
          this.getLaunchs();
        })
      })
    });

    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._launchs$.next(result.launchs);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  public checkDuplicate(launch: launch): Observable<any>{
    return this.http.post<boolean>(this.baseUrl + 'launchs/checkDuplicate',launch);
  }


  public getLaunchs(): void {
    this.findAllByMonthAndYear(this.monthId, this.year, this.accountFilter).subscribe((s) => {
      // if (this.monthId == 0) {
      //   //this.launchs = s.sort((a, b) => (a.day > b.day ? -1 : 1));
      //   this.launchs = s;
      //   this._launchs$.next(this.launchs);
      // } else {
        this.launchs = s;
        //   .filter((s) => new Date(s.day).getMonth() ===  this.monthId - 1);
        //   //.sort((a, b) => (a.day > b.day ? -1 : 1));
        //console.log('1',this.launchs$);
        setTimeout( () => {  this._launchs$.next(this.launchs); }, 2000 );

        //console.log('2',this.launchs$);
     // }
    });
  }

  import(entity: ImportRequest, accountId): Observable<ImportRequest> {
    return this._http.post<ImportRequest>(this._base + `/import/${accountId}`, entity);
  }

  get launchs$() {
    return this._launchs$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    /* SORT LAUNCHS */
    // 1. sort
    let launchs = sort(this.launchs, sortColumn, sortDirection);

    // 2. filter
    launchs = launchs.filter((f:any) =>
      matchesLaunch(f, searchTerm, this.pipe)
    );
    const total = launchs.length;

    // 3. paginate
    launchs = launchs.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    /* end sort countries */

    return of({ launchs, total  });
  }
}
