import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { ConnectComponent } from './connect/connect.component';
import { DashboardComponent } from './dashboard.component';
import { NotFoundComponent } from './not-found.component';

const appRoutes: Routes = [
  { path: 'login', component: ConnectComponent, title: 'Connect with Twitch' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'TrAsKiN Stream Alerts',
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
