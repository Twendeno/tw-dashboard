import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {GeometryService} from "@app/services/dashboard/geometry.service";
import { StationService } from '@app/services/dashboard/station.service';
import {DirectionService} from "@app/services/dashboard/direction.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {HttpEventType} from "@angular/common/http";
import {filter} from "rxjs";

@Component({
  selector: 'app-direction-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './direction-list.component.html',
  styleUrl: './direction-list.component.css'
})
export class DirectionListComponent implements OnInit{

  readonly geometryService = inject(GeometryService);
  readonly stationService = inject(StationService);
  readonly directionService = inject(DirectionService);
  private readonly fb = inject(FormBuilder);


  stations$ = signal(this.stationService.coordinates);
  geometries$ = signal(this.geometryService.geometries);
  directions$ = signal(this.directionService.directions);

  directionForm = this.fb.group({
    geometry_uuid: ['',[Validators.required]],
    coordinate_uuid: ['', [Validators.required]],
    assignedBy : ['admin', [Validators.required]],
  });

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.directionForm.invalid){
      return;
    }

    const direction = {
      geometry_uuid: this.directionForm.value.geometry_uuid!,
      coordinate_uuid: this.directionForm.value.coordinate_uuid!,
      assignedBy: this.directionForm.value.assignedBy!,
    };

    this.directionService.create(direction).subscribe((event: any) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
          break;
        case HttpEventType.Response:
          this.directionForm.reset();
          this.directions$.set(this.directionService.directions);
          break;
      }
    });

  }

  protected readonly filter = filter;
}
