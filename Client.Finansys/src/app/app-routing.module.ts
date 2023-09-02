import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchImportComponent } from './pages/internal/launch/launch-import/launch-import.component';
import { LoginComponent } from './pages/external/login/login.component';
import { AuthGuard } from './core/guard/auth.guard';
import { AppComponent } from './app.component';
import { BudgetListComponent } from './pages/internal/budget/budget.component';
import { LaunchComponent } from './pages/internal/launch/launch.component';
import { DashBoardComponent } from './pages/internal/dashboard/dashboard.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: AppComponent,
  },
  {
    path: 'dashboard',
    component: DashBoardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'budget',
    component: BudgetListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'launch',
    component: LaunchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'import',
    component: LaunchImportComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'dashboard' },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
