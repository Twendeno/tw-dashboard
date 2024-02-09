import {Component, inject, OnInit, signal} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {GeometryService} from "@app/services/dashboard/geometry/geometry.service";
import {StationService} from "@app/services/dashboard/station/station.service";
import {HttpEventType} from "@angular/common/http";
import {DirectionService} from "@app/services/dashboard/direction/direction.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DialogResponse} from "@app/models/dialog-response";

@Component({
  selector: 'app-direction-form',
  standalone: true,
    imports: [
        AsyncPipe,
        ReactiveFormsModule
    ],
  templateUrl: './direction-form.component.html',
  styleUrl: './direction-form.component.css'
})
export class DirectionFormComponent implements OnInit{

  private readonly fb = inject(FormBuilder);
  private readonly geometryService = inject(GeometryService);
  private readonly stationService = inject(StationService);
  private readonly directionService = inject(DirectionService);

  stations$ = signal(this.stationService.allCoordinates());
  geometries$ = signal(this.geometryService.allGeometries());


  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  protected readonly dataExtras = this.config.data;

  directionForm = this.fb.group({
    departure: ['', [Validators.required]],
    arrival: ['', [Validators.required]],
    geometry_uuid: ['',[Validators.required]],
    coordinate_uuid: ['', [Validators.required]],
    assignedBy : ['admin', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.dataExtras.isEdit) {
      this.directionForm.patchValue({
        departure: this.dataExtras.dynamicData.departure,
        arrival: this.dataExtras.dynamicData.arrival,
        geometry_uuid: this.dataExtras.dynamicData.geometry_uuid,
        coordinate_uuid: this.dataExtras.dynamicData.coordinate_uuid,
        assignedBy: this.dataExtras.dynamicData.assignedBy,
      });
    }
  }

  onSubmit() {
    if (this.directionForm.invalid){
      return;
    }

    const direction = {
      departure: this.directionForm.value.departure!,
      arrival: this.directionForm.value.arrival!,
      geometry_uuid: this.directionForm.value.geometry_uuid!,
      coordinate_uuid: this.directionForm.value.coordinate_uuid!,
      assignedBy: this.directionForm.value.assignedBy!,
    };

    if (this.dataExtras.isEdit) {
      this.directionService.update(this.dataExtras.dynamicData.uuid, direction).subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.directionForm.reset();
            this.ref.close(DialogResponse.UPDATE);
            break;
        }
      });
      return;
    }

    this.directionService.create(direction).subscribe((event: any) => {

      switch (event.type) {
        case HttpEventType.UploadProgress:
          console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
          break;
        case HttpEventType.Response:
          this.directionForm.reset();
          this.ref.close(DialogResponse.CREATE);
          break;
      }
    });

  }

}
