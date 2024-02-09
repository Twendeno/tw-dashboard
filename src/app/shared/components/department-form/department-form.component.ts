import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpEventType} from "@angular/common/http";
import {DialogResponse} from "@app/models/dialog-response";
import {DepartmentService} from "@app/services/dashboard/department/department.service";
import {GeometryService} from "@app/services/dashboard/geometry/geometry.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css'
})
export class DepartmentFormComponent implements OnInit{

  private readonly departmentService = inject(DepartmentService);

  private readonly fb = inject(FormBuilder);

  private geoJsonFromFile: any = { "message": 'hello Twendeno 🌍❤️🫵' }

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  dataExtras = this.config.data;

  departmentForm = this.fb.group({
    name: ['', [Validators.required]],
    assignedBy: ['admin'],
    lastModifiedBy : ['admin'],
    area: [0],
    geodata:['']
  });


  ngOnInit(): void {
    if (this.dataExtras.isEdit) {
      this.departmentForm.patchValue({
        name: this.dataExtras.dynamicData.name,
        area: this.dataExtras.dynamicData.area,
        assignedBy: this.dataExtras.dynamicData.assignedBy,
        lastModifiedBy: this.dataExtras.dynamicData.lastModifiedBy,
        geodata: this.dataExtras.dynamicData.geodata
      });
    }
  }

  onSubmit() {
    if (this.departmentForm.invalid) {
      return;
    }

    this.departmentForm.value.geodata = JSON.stringify(this.geoJsonFromFile)

    if (this.dataExtras.isEdit) {
      this.departmentService
        .update(this.dataExtras.dynamicData.uuid, this.departmentForm.value)
        .subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
              break;
            case HttpEventType.Response:
              this.departmentForm.reset();
              this.ref.close(DialogResponse.UPDATE);
              break;
            case HttpEventType.ResponseHeader:
              break;
          }
        });
      return;
    }

    this.departmentService
      .create(this.departmentForm.value)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.departmentForm.reset();
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
    return this.departmentForm.get('name')!;
  }

}
