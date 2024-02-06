import {Component, inject, input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpEventType} from "@angular/common/http";
import {GeometryService} from "@app/services/dashboard/geometry/geometry.service";
import {GeometryType} from "@app/models/geometry-type";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DialogResponse} from "@app/models/dialog-response";
import {TownService} from "@app/services/dashboard/town/town.service";
import {DepartmentService} from "@app/services/dashboard/department/department.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {StationService} from "@app/services/dashboard/station/station.service";
import {DirectionService} from "@app/services/dashboard/direction/direction.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-geometry-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    JsonPipe,
    RouterLink
  ],
  templateUrl: './geometry-form.component.html',
  styleUrl: './geometry-form.component.css'
})
export class GeometryFormComponent implements OnInit{

  private readonly geometryService = inject(GeometryService);
  private readonly townService = inject(TownService);
  private readonly stationService = inject(StationService);
  private readonly directionService = inject(DirectionService);
  private readonly departmentService = inject(DepartmentService);
  private readonly fb = inject(FormBuilder);

  private geoJsonFromFile: any = { "message": 'hello Twendeno 🫵🫵🫵' }

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  towns$ = this.townService.allTowns();
  departments$ = this.departmentService.allDepartments();

  protected readonly geometryTypes = input([
      GeometryType.POINT, GeometryType.LINESTRING, GeometryType.POLYGON,
      GeometryType.MULTIPOINT, GeometryType.MULTILINESTRING, GeometryType.MULTIPOLYGON,
      GeometryType.GEOMETRYCOLLECTION, GeometryType.FEATURE, GeometryType.FEATURECOLLECTION
    ]
  );

  dataExtras = this.config.data;

  geometryForm = this.fb.group({
    name: ['', [Validators.required]],
    department_uuid: ['', [Validators.required]],
    type: ['', [Validators.required]],
    town_uuid: ['', [Validators.required]],
    geodata:[''],
    assignedBy:['admin',[Validators.required]],
    lastModifiedBy:['admin',[Validators.required]]
  });


  ngOnInit(): void {
    if (this.dataExtras.isEdit) {
      this.geometryForm.patchValue({
        name: this.dataExtras.dynamicData.name,
        department_uuid: this.dataExtras.dynamicData.department_uuid,
        town_uuid: this.dataExtras.dynamicData.town_uuid,
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
        .update(this.dataExtras.dynamicData.uuid, this.geometryForm.value)
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
      .create( this.geometryForm.value)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.geometryForm.reset();
            this.createCoordinateFromFile(event.body.data.name,event.body.data.uuid);
            // this.ref.close(DialogResponse.CREATE);
            break;
        }
      });
  }

  createCoordinateFromFile(geometry_name: string,geometry_uuid:string){

    if (!Object.keys(this.geoJsonFromFile).includes('coordinates')) this.ref.close(DialogResponse.CREATE);

    if (Object.keys(this.geoJsonFromFile).includes('coordinates')){
      this.stationService.createMany(this.geoJsonFromFile.coordinates).subscribe((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.linkedGeometryToCoordinate(geometry_uuid);
            break;
        }
      })
    }
  }

  linkedGeometryToCoordinate(geometry_uuid:string){
    for (const  [longitude, latitude] of this.geoJsonFromFile.coordinates ) {
      let latLng = [latitude, longitude].toString();

      this.stationService.findOneByLatLng(latLng).subscribe((res) => {

        const direction = {
          geometry_uuid,
          coordinate_uuid: res.data.uuid,
          assignedBy: 'admin',
        };

        this.directionService.create(direction).subscribe((event) => {
          this.ref.close(DialogResponse.CREATE);
        });

      });

    }
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

  protected readonly Object = Object;
}
