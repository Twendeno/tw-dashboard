import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NavBarService} from "@app/services/navbar/nav-bar.service";
import {NgOptimizedImage} from "@angular/common";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {TieredMenuModule} from "primeng/tieredmenu";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    BreadcrumbModule,
    TieredMenuModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  protected readonly navBarService = inject(NavBarService);
  protected isVisible = false;
  onShowNotification(){ this.isVisible = !this.isVisible; }
}
