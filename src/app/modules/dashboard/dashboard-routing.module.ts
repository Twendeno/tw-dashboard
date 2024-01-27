import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from "@app/modules/profile/components/profile/profile.component";
import {HomeComponent} from "@app/modules/dashboard/components/home/home.component";
import {UserListComponent} from "@app/modules/dashboard/components/user-list/user-list.component";
import {DepartmentListComponent} from "@app/modules/dashboard/components/department-list/department-list.component";
import {TownListComponent} from "@app/modules/dashboard/components/town-list/town-list.component";
import {DistrictListComponent} from "@app/modules/dashboard/components/district-list/district-list.component";
import {LineListComponent} from "@app/modules/dashboard/components/line-list/line-list.component";
import {StationsListComponent} from "@app/modules/dashboard/components/stations-list/stations-list.component";
import {DirectionListComponent} from "@app/modules/dashboard/components/direction-list/direction-list.component";
import {ToolsComponent} from "@app/modules/tools/components/tools/tools.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'users', component: UserListComponent},
  {
    path: 'profile', component: ProfileComponent,
    children: [
      {path: '', loadChildren: () => import('@app/modules/profile/profile.module').then(m => m.ProfileModule)}
    ]
  },
  {path: 'departments', component: DepartmentListComponent},
  {path: 'towns', component: TownListComponent},
  {path: 'districts', component: DistrictListComponent},
  {path: 'lines', component: LineListComponent},
  {path: 'stations', component: StationsListComponent},
  {path: 'directions', component: DirectionListComponent},
  {
    path: 'tools', component: ToolsComponent,
    children: [
      {path: '', loadChildren: () => import('@app/modules/tools/tools.module').then(m => m.ToolsModule)}
    ]
  },
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
