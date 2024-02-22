import {Component, inject, ViewChild} from '@angular/core';
import {JsonEditorComponent, JsonEditorOptions, NgJsonEditorModule} from "ang-jsoneditor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DepartmentService} from "@app/services/dashboard/department/department.service";
import {TownService} from "@app/services/dashboard/town/town.service";
import {DistrictService} from "@app/services/dashboard/district/district.service";
import {GeometryService} from "@app/services/dashboard/geometry/geometry.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {EntityName} from "@app/models/entity-name";

@Component({
  selector: 'app-json-linter',
  standalone: true,
  imports: [NgJsonEditorModule, ReactiveFormsModule, FormsModule, AsyncPipe, RouterLink, JsonPipe],
  templateUrl: './json-linter.component.html',
  styleUrl: './json-linter.component.css'
})
export class JsonLinterComponent  {

  private readonly departmentService = inject(DepartmentService);
  private readonly townService = inject(TownService);
  private readonly DistrictService = inject(DistrictService);
  private readonly LineService = inject(GeometryService);

  protected readonly typeOfObjects = [EntityName.DEPARTMENT, EntityName.DISTRICT, EntityName.TOWN, EntityName.LINE];
  protected selectedObjectType = 'Select object type';

  protected readonly departments$ = this.departmentService.allDepartments();
  protected readonly towns$ = this.townService.allTowns();
  protected readonly districts$ = this.DistrictService.allDistricts();
  protected readonly lines$ = this.LineService.allGeometries();

  protected  dataObjectTypeSelected :any


  protected editorOptionsLeft: JsonEditorOptions = new JsonEditorOptions();
  protected data = {"message":"hello Twendeno 🌍❤️🫵"}
  @ViewChild(JsonEditorComponent, { static: false }) editor!: JsonEditorComponent;

  protected fileName = `geojson`;
  constructor() {
    this.editorOptionsLeft.modes = ['code', 'view','tree','text','form']; // set all allowed modes
    this.editorOptionsLeft.mode = 'code'; //set only one mode
  }

  downloadJsonFile(jsonData: any): void {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `geojson-${this.fileName.replace(/[^a-zA-Z0-9]|\./g, '')}-${new Date().toLocaleString().replace(/[\/,: ]/g, '')}.json`;

    link.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.readJsonFile(file);
      this.fileName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]|\./g, '');
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

  onObjectTypeSelected(event:any): void {
    this.selectedObjectType = event.target.value;
  }

  onSubmitGeodataOnline(): void {
    this.data = JSON.parse(this.dataObjectTypeSelected)
  }
}
