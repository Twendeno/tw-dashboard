import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  providers:[DialogService,ConfirmationService]
})
export class DashboardModule { }
