import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {environment} from "@env/environment";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  year: number = new Date().getFullYear();
  twWebSite = environment.TWENDENO.WEBSITE
  twBlog = environment.TWENDENO.BLOG
  twLicence= environment.TWENDENO.LICENCE
}
