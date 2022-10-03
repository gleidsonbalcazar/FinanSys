import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetListComponent } from './pages/budget/budget.component';
import { DashBoardComponent } from './pages/dashboard/dashboard.component';
import { LaunchImportComponent } from './pages/launch/launch-import/launch-import.component';
import { LaunchComponent } from './pages/launch/launch.component';


const routes: Routes = [
  {
    path: "",
    component: DashBoardComponent,
  },
  {
    path: "budget",
    component: BudgetListComponent,
  },
  {
    path: "launch",
    component: LaunchComponent
  },
  {
    path: "import",
    component: LaunchImportComponent
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
