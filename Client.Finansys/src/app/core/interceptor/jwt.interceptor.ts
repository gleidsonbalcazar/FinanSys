import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService,@Inject("BASE_URL") private baseUrl: string) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const login = this.loginService.currentUserValue;
        const isLoggedIn = login && login.token;
        const isApiUrl = request.url.startsWith(`${this.baseUrl}`);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${login.token}`
                }
            });
        }

        return next.handle(request).pipe(catchError( err => {
          if(err.status === 401){
            this.loginService.logout();
            return throwError("session expired");
          }
          return throwError(err);
        }))
    }
}
