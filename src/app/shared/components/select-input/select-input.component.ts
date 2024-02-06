import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-select-input',
  standalone: true,
    imports: [
        AsyncPipe,
        ReactiveFormsModule
    ],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css'
})
export class SelectInputComponent {
@Input() label: string = '';
@Input() optionsData: any[] = [];
@Input() controlName: string = '';
@Input() hasUuid: boolean = true;

@Output() selectedOption = new EventEmitter<any>();


}
