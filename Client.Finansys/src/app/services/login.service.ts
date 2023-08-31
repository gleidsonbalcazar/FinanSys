import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';


@Injectable({ providedIn: 'root' })
export class LoginService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public isLoggedSubject = new BehaviorSubject<boolean>(false);
  public isLogged:Observable<boolean>;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {
    this.initiateCurrentUser();
  }

  public get currentUserValue(): User {
    this.initiateCurrentUser();
    return this.currentUserSubject.value;
  }

  initiateCurrentUser():void{
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public isUserLogged(): Observable<boolean>{
    return this.isLoggedSubject.asObservable();
  }


  login(username: string, password: string) {
    return this.http
      .post<any>(`${this.baseUrl}Login/authenticate`, { username, password })
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.isLoggedSubject.next(true);
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }
}
