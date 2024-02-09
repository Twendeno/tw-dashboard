import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {DepartmentService} from "@app/services/dashboard/department/department.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpEventType} from "@angular/common/http";
import {DialogResponse} from "@app/models/dialog-response";
import {StationService} from "@app/services/dashboard/station/station.service";
import {TownService} from "@app/services/dashboard/town/town.service";
import {AsyncPipe, JsonPipe} from "@angular/common";

@Component({
  selector: 'app-town-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './town-form.component.html',
  styleUrl: './town-form.component.css'
})
export class TownFormComponent implements OnInit{

  private readonly departmentService = inject(DepartmentService);
  private readonly stationService = inject(StationService);
  private readonly townService = inject(TownService);

  departments$ = this.departmentService.allDepartments();
  stations$ = this.stationService.allCoordinates();

  private readonly fb = inject(FormBuilder);

  private geoJsonFromFile: any = { "message": 'hello Twendeno 🌍❤️🫵' }

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  dataExtras = this.config.data;

  townForm = this.fb.group({
    name: ['', [Validators.required]],
    assignedBy: ['admin'],
    lastModifiedBy : ['admin'],
    area: [0],
    department_uuid: ['',[Validators.required]],
    coordinate_uuid: ['',[Validators.required]],
    geodata:['']
  });


  ngOnInit(): void {
    if (this.dataExtras.isEdit) {
      this.townForm.patchValue({
        name: this.dataExtras.dynamicData.name,
        area: this.dataExtras.dynamicData.area,
        assignedBy: this.dataExtras.dynamicData.assignedBy,
        lastModifiedBy: this.dataExtras.dynamicData.lastModifiedBy,
        department_uuid: this.dataExtras.dynamicData.department_uuid,
        coordinate_uuid: this.dataExtras.dynamicData.coordinate_uuid,
        geodata: this.dataExtras.dynamicData.geodata
      });
    }
  }

  onSubmit() {
    if (this.townForm.invalid) {
      return;
    }

    this.townForm.value.geodata = JSON.stringify(this.geoJsonFromFile)

    if (this.dataExtras.isEdit) {
      this.townService
        .update(this.dataExtras.dynamicData.uuid, this.townForm.value)
        .subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
              break;
            case HttpEventType.Response:
              this.townForm.reset();
              this.ref.close(DialogResponse.UPDATE);
              break;
            case HttpEventType.ResponseHeader:
              break;
          }
        });
      return;
    }

    this.townService
      .create(this.townForm.value)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.townForm.reset();
            this.ref.close(DialogResponse.CREATE);
            break;
          case HttpEventType.ResponseHeader:
            break;
        }
      });
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
        this.geoJsonFromFile = JSON.parse(e.target.result);
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier JSON :', error);
      }
    };

    reader.readAsText(file);
  }

  get name() {
    return this.townForm.get('name')!;
  }

}
