import {Routes} from '@angular/router';
import {DashboardComponent} from "@app/modules/dashboard/components/dashboard/dashboard.component";

export const routes: Routes = [
  {path: 'auth', loadChildren: () => import('@app/modules/auth/auth.module').then(m => m.AuthModule)},
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {path: '', loadChildren: () => import('@app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)}
    ]
  },
  {path: '', redirectTo: '/auth', pathMatch: 'full'},
  {path: '**', redirectTo: '/auth'}
];
