import {Component, input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Constant} from "@app/shared/utils/constant/constant";
import {environment} from "@env/environment";

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
      {name: 'Users', route: 'users',icon: 'assets/img/shapes/users.svg'},
      {name: 'Tools', route: 'tools',icon: 'assets/img/shapes/tools.svg'},
    ]
  );

  optionsList = input([
      {name: 'Departments', route: 'departments',icon: 'assets/img/shapes/department.svg'},
      {name: 'Towns', route: 'towns',icon: 'assets/img/shapes/town.svg'},
      {name: 'Districts', route: 'districts',icon: 'assets/img/shapes/district.svg'},
    ]
  );

  transportList = input([
      {name: 'Lines', route: 'lines',icon: 'assets/img/shapes/line.svg'},
      {name: 'Stations', route: 'stations',icon: 'assets/img/shapes/station.svg'},
      {name: 'directions', route: 'directions',icon: 'assets/img/shapes/direction.svg'},
    ]
  );

  apiDocLink = `${environment.MS_RX_API.URL}api-docs`;
}
