import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-row-item',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './row-item.component.html',
  styleUrl: './row-item.component.css'
})
export class RowItemComponent {

}
