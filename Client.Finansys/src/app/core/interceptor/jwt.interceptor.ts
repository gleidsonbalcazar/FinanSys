import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService,@Inject("BASE_URL") private baseUrl: string) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        console.log(this.loginService.currentUserValue);
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

        return next.handle(request);
    }
}
