import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JsonLinterComponent} from "@app/modules/tools/components/json-linter/json-linter.component";
import {GeoCalculComponent} from "@app/modules/tools/components/geo-calcul/geo-calcul.component";
import {ToolsMenuListComponent} from "@app/modules/tools/components/tools-menu-list/tools-menu-list.component";

const routes: Routes = [
  {path:'',component: ToolsMenuListComponent},
  {path:'json-editor',title:'Json-editor',component:JsonLinterComponent},
  {path:'geo-calculator',title:'Geo-calculator',component:GeoCalculComponent},
  {path:'**',component: ToolsMenuListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
