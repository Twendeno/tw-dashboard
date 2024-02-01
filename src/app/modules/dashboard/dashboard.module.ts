import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  providers:[DialogService,MessageService,ConfirmationService]
})
export class DashboardModule { }
