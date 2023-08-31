import { NgModule } from "@angular/core";
import { ModalComponent } from "../../core/modal/modal.component";
import { UploadComponent } from "../../core/upload/upload.component";
import { BudgetListComponent } from "./budget/budget.component";
import { BudgetIndicatorsModalComponent } from "./budget/budgetIndicators/budgetIndicators.modal.component";
import { BudgetManagerModalComponent } from "./budget/budgetManager/budgetManager.modal.component";
import { BudgetWordsModalComponent } from "./budget/budgetWords/budgetWords.modal.component";
import { DashBoardComponent } from "./dashboard/dashboard.component";
import { LaunchImportComponent } from "./launch/launch-import/launch-import.component";
import { LaunchModalComponent } from "./launch/launch-modal/launch.modal.component";
import { LaunchComponent } from "./launch/launch.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartsModule } from "ng2-charts";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxLoadingModule } from "ngx-loading";
import { DropdownMultiselectModule } from "../../core/dropdown-multiselect/dropdown-multiselect.module";
import { LoaderModule } from "../../core/load/loader.module";
import { ConfirmDialogModule } from "../../core/modal/confirm/confirm-dialog.module";
import { PipeModule } from "../../core/pipes/pipemodule";
import { DirectivesModule } from "src/app/core/directives/directives.module";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownMultiselectModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    CurrencyMaskModule,
    FormsModule,
    //AlertModule,
    NgbModule,
    ChartsModule,
    PipeModule,
    DirectivesModule,
    LoaderModule,
    NgxLoadingModule,
  ],
  declarations: [
    LaunchComponent,
    BudgetListComponent,
    UploadComponent,
    ModalComponent,
    LaunchImportComponent,
    LaunchModalComponent,
    DashBoardComponent,
    BudgetManagerModalComponent,
    BudgetWordsModalComponent,
    BudgetIndicatorsModalComponent,
  ],
  providers: [],
  exports:[]
})

export class PagesInternalModule {

}
