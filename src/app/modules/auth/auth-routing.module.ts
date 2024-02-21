import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from "@app/modules/auth/components/sign-in/sign-in.component";

const routes: Routes = [
  {path: '', redirectTo: '/auth/sign-in', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent,title: 'Sign In'},
  {path: '**', redirectTo: '/auth/sign-in'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
