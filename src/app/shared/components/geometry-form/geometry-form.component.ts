import {Component, inject, input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpEventType} from "@angular/common/http";
import {GeometryService} from "@app/services/dashboard/geometry/geometry.service";
import {GeometryType} from "@app/models/geometry-type";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DialogResponse} from "@app/models/dialog-response";

@Component({
  selector: 'app-geometry-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './geometry-form.component.html',
  styleUrl: './geometry-form.component.css'
})
export class GeometryFormComponent implements OnInit{

  private readonly geometryService = inject(GeometryService);
  private readonly fb = inject(FormBuilder);

  private geoJsonFromFile: any = { "message": 'hello Twendeno 🫵🫵🫵' }

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  geometryTypes = input([
      GeometryType.POINT, GeometryType.LINESTRING, GeometryType.POLYGON,
      GeometryType.MULTIPOINT, GeometryType.MULTILINESTRING, GeometryType.MULTIPOLYGON,
      GeometryType.GEOMETRYCOLLECTION, GeometryType.FEATURE, GeometryType.FEATURECOLLECTION
    ]
  );

  dataExtras = this.config.data;

  geometryForm = this.fb.group({
    name: ['', [Validators.required]],
    type: ['', [Validators.required]],
    geodata:['']
  });


  ngOnInit(): void {
    if (this.dataExtras.isEdit) {
      this.geometryForm.patchValue({
        name: this.dataExtras.dynamicData.name,
        type: this.dataExtras.dynamicData.type,
        geodata: this.dataExtras.dynamicData.geodata
      });
    }
  }

  onSubmit() {
    if (this.geometryForm.invalid) {
      return;
    }

    this.geometryForm.value.geodata = JSON.stringify(this.geoJsonFromFile)

    if (this.dataExtras.isEdit) {
      this.geometryService
        .update(this.dataExtras.dynamicData.uuid, this.geometryForm.value.name!, this.geometryForm.value.type!, this.geometryForm.value.geodata!)
        .subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
              break;
            case HttpEventType.Response:
              this.geometryForm.reset();
              this.ref.close(DialogResponse.UPDATE);
              break;
            case HttpEventType.ResponseHeader:
              console.log(event);
              break;
          }
        });
      return;
    }

    this.geometryService
      .create(this.geometryForm.value.name!, this.geometryForm.value.type!, this.geometryForm.value.geodata!)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.geometryForm.reset();
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
    return this.geometryForm.get('name')!;
  }

  get type() {
    return this.geometryForm.get('type')!;
  }

}
