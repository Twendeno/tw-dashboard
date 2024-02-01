import {Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AsideBarComponent} from "@app/shared/components/aside-bar/aside-bar.component";
import {NavBarComponent} from "@app/shared/components/nav-bar/nav-bar.component";
import {FooterComponent} from "@app/shared/components/footer/footer.component";
import {NavBarService} from "@app/services/navbar/nav-bar.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    AsideBarComponent,
    NavBarComponent,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  navBarService = inject(NavBarService);
}
