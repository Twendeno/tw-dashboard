import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NavBarService} from "@app/services/navbar/nav-bar.service";
import {NgOptimizedImage} from "@angular/common";
import {BreadcrumbModule} from "primeng/breadcrumb";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    BreadcrumbModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  navBarService = inject(NavBarService);
}
