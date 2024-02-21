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
import {PrivacyPolicyComponent} from "@app/shared/components/privacy-policy/privacy-policy.component";
import {AboutUsComponent} from "@app/shared/components/about-us/about-us.component";
import {DetailLineComponent} from "@app/modules/dashboard/components/detail-line/detail-line.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent,title:'Home'},
  {path: 'users', component: UserListComponent,title:'Users'},
  {
    path: 'profile', component: ProfileComponent,title:'Profile',
    children: [
      {path: '', loadChildren: () => import('@app/modules/profile/profile.module').then(m => m.ProfileModule)}
    ]
  },
  {path: 'departments',title:'Departments', component: DepartmentListComponent},
  {path: 'towns',title:'Towns', component: TownListComponent},
  {path: 'districts',title:'Districts', component: DistrictListComponent},
  {path: 'lines', title:'Lines',component: LineListComponent},
  {path: 'stations', title:'Stations',component: StationsListComponent},
  {path: 'directions', title:'Directions',component: DirectionListComponent},
  {
    path: 'tools', title:'Tools',component: ToolsComponent,
    children: [
      {path: '', loadChildren: () => import('@app/modules/tools/tools.module').then(m => m.ToolsModule)}
    ]
  },
  {path: 'privacy-policy', title:'Privacy-policy',component: PrivacyPolicyComponent},
  {path: 'about-us', title:'About us',component: AboutUsComponent},
  {path: 'detail-line/:uuid', title:'detail-line',component: DetailLineComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
