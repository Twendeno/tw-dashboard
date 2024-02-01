import {Component, ViewChild} from '@angular/core';
import {JsonEditorComponent, JsonEditorOptions, NgJsonEditorModule} from "ang-jsoneditor";
import {MethodeUtil} from "@app/shared/utils/methode.util";

@Component({
  selector: 'app-json-linter',
  standalone: true,
  imports: [NgJsonEditorModule],
  templateUrl: './json-linter.component.html',
  styleUrl: './json-linter.component.css'
})
export class JsonLinterComponent  {

  editorOptionsLeft: JsonEditorOptions = new JsonEditorOptions();
  data = {"message":"hello Twendeno 🫵🫵🫵"}
  @ViewChild(JsonEditorComponent, { static: false }) editor!: JsonEditorComponent;

  constructor() {
    this.editorOptionsLeft.modes = ['code', 'view','tree','text','form']; // set all allowed modes
    this.editorOptionsLeft.mode = 'code'; //set only one mode
  }

  getData($event: any) {
    //this.data = $event;
  }

  downloadJsonFile(jsonData: any, fileName: string): void {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName + '.json';

    link.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.readJsonFile(file);
    }
  }

  readJsonFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        this.data = JSON.parse(e.target.result);
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier JSON :', error);
      }
    };

    reader.readAsText(file);
  }
}
