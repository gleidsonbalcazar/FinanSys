import { DecimalPipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AlertModule } from './core/alertComponent/alert.module';
import { ConfirmDialogModule } from './core/modal/confirm/confirm-dialog.module';
import { PipeModule } from './core/pipes/pipemodule';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownMultiselectModule } from './core/dropdown-multiselect/dropdown-multiselect.module';
import { NgxLoadingModule } from 'ngx-loading';
import { LoaderModule } from './core/load/loader.module';
import { LoaderInterceptor } from './core/load/loader.interceptor';
import { LoginComponent } from './pages/external/login/login.component';
import { LoginService } from './services/login.service';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { PagesInternalModule } from './pages/internal/pages-internal.module';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    PagesInternalModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownMultiselectModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    FormsModule,
    AlertModule,
    NgbModule,
    ChartsModule,
    ConfirmDialogModule,
    PipeModule,
    LoaderModule,
    NgxLoadingModule,
    ToastrModule.forRoot({
      timeOut: 1600,
      maxOpened: 0,
      autoDismiss: true,
      preventDuplicates: true,
      progressBar: true,
      positionClass: 'toast-top-right'
    }),
    NgbModule,
  ],
  providers: [
    DecimalPipe,
    AppService,
    LoginService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor,  multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

