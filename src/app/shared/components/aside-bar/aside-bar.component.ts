import {Component, input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.css'
})
export class AsideBarComponent {

  personalList = input([
      {name: 'Users', route: 'users'},
      {name: 'Profile', route: 'profile'},
      {name: 'Tools', route: 'tools'},
    ]
  );

  optionsList = input([
      {name: 'Departments', route: 'departments'},
      {name: 'Towns', route: 'towns'},
      {name: 'Districts', route: 'districts'},
    ]
  );

  transportList = input([
      {name: 'Lines', route: 'lines'},
      {name: 'Stations', route: 'stations'},
      {name: 'directions', route: 'directions'},
    ]
  );
}
