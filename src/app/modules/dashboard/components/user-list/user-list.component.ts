import {Component, inject} from '@angular/core';
import {NavBarService} from "@app/services/navbar/nav-bar.service";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  navBarService = inject(NavBarService);

}
