import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AlertService } from '../alertComponent/alert.service';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService, private toastr: ToastrService) { }

    options =  {
      autoClose: false,
      keepAfterRouteChange: false
    };

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
          tap(evt => {
            if(evt instanceof HttpResponse){
              if([201,202,204].includes(evt.status)){
                this.toastr.success("Operação realizada com sucesso")
              } else if(evt.status == 500){
                this.toastr.error("Houve um erro na operação, visualize o log.")
              }
            }
          }),
          catchError(err => {
            const error = (err && err.error && err.error.message) || err.statusText;
            this.alertService.error(`<strong>Houve um erro:</strong> ${error}`, this.options)
            return throwError(error);
        }))
    }
}
