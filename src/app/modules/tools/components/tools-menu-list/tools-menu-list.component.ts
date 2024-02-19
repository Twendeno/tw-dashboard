import {Component, inject, input} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-tools-menu-list',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './tools-menu-list.component.html',
  styleUrl: './tools-menu-list.component.css'
})
export class ToolsMenuListComponent {
  private readonly router = inject(Router)
  //#rocket-white.png
  toolsList = input([
      {
        name: 'JSON editor',
        description: 'The JSON Editor makes it possible to easily view, edit, and validate JSON documents.',
        image:'assets/img/json-editor.png',
        route: 'json-editor'
      },
      {
        name: 'Géo-calculator',
        description: 'The GEO calculator is a tool for calculating geographical coordinates.',
        image:'assets/img/geo-calculator.png',
        route: 'geo-calculator'
      },
    ]
  )

  onClickGoTo(route: any) {
    this.router.navigate(['/dashboard','tools',route])
  }
}
