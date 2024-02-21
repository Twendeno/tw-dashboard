import {Component, inject} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  constructor() {
    inject(Title).setTitle('Sign In');
  }
}
