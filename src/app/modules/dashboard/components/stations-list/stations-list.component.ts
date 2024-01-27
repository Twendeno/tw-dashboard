import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {StationService} from "@app/services/dashboard/station.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {Station} from "@app/models/dashboard/station";
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-stations-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    AsyncPipe
  ],
  templateUrl: './stations-list.component.html',
  styleUrl: './stations-list.component.css'
})
export class StationsListComponent {

  private readonly fb = inject(FormBuilder);
  stationForm = this.fb.group({
    latitude: ['', [Validators.required]],
    longitude: ['', [Validators.required]],
    isStop: [false],
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });

  stationService = inject(StationService);
  stations = signal(this.stationService.coordinates);

  onSubmit() {
    if (this.stationForm.invalid) {
      return;
    }

    const station = {
      latitude: Number(this.stationForm.value.latitude!),
      longitude: Number(this.stationForm.value.longitude!),
      isStop: this.stationForm.value.isStop!,
      name: this.stationForm.value.name!,
      address: this.stationForm.value.address!,
    };

    this.stationService.create(station).subscribe((event: any) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
          break;
        case HttpEventType.Response:
          this.stationForm.reset();
          this.stations.set(this.stationService.coordinates)
          break;
      }
    });

  }
}
