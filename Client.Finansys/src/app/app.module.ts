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
import { NgbdSortableHeader } from './core/directives/sort/sortable.directive';
import { ConfirmDialogModule } from './core/modal/confirm/confirm-dialog.module';
import { ModalComponent } from './core/modal/modal.component';
import { PipeModule } from './core/pipes/pipemodule';
import { UploadComponent } from './core/upload/upload.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { BudgetListComponent } from './pages/budget/budget.component';
import { BudgetIndicatorsModalComponent } from './pages/budget/budgetIndicators/budgetIndicators.modal.component';
import { BudgetManagerModalComponent } from './pages/budget/budgetManager/budgetManager.modal.component';
import { BudgetWordsModalComponent } from './pages/budget/budgetWords/budgetWords.modal.component';
import { DashBoardComponent } from './pages/dashboard/dashboard.component';
import { LaunchImportComponent } from './pages/launch/launch-import/launch-import.component';
import { LaunchComponent } from './pages/launch/launch.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { DropdownMultiselectModule } from './core/dropdown-multiselect/dropdown-multiselect.module';
import { NgxLoadingModule } from 'ngx-loading';
import { LoaderModule } from './core/load/loader.module';
import { LoaderInterceptor } from './core/load/loader.interceptor';
import { LaunchModalComponent } from './pages/launch/launch-modal/launch.modal.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginService } from './services/login.service';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavMenuComponent,
    LaunchComponent,
    BudgetListComponent,
    LoginComponent,
    UploadComponent,
    ModalComponent,
    LaunchImportComponent,
    LaunchModalComponent,
    DashBoardComponent,
    NgbdSortableHeader,
    BudgetManagerModalComponent,
    BudgetWordsModalComponent,
    BudgetIndicatorsModalComponent
  ],
  imports: [
    BrowserModule,
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
    NgbModule
  ],
  providers: [
    DecimalPipe,
    AppService,
    LoginService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

