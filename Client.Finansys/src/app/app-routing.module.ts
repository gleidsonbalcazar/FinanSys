import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetListComponent } from './pages/budget/budget.component';
import { DashBoardComponent } from './pages/dashboard/dashboard.component';
import { LaunchImportComponent } from './pages/launch/launch-import/launch-import.component';
import { LaunchComponent } from './pages/launch/launch.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guard/auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: "",
    component: DashBoardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "budget",
    component: BudgetListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "launch",
    component: LaunchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "import",
    component: LaunchImportComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
