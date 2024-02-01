import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpEventType} from "@angular/common/http";
import {StationService} from "@app/services/dashboard/station/station.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DialogResponse} from "@app/models/dialog-response";

@Component({
  selector: 'app-station-form',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.css'
})
export class StationFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private stationService = inject(StationService);

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  protected readonly dataExtras = this.config.data;

  stationForm = this.fb.group({
    latitude: ['', [Validators.required]],
    longitude: ['', [Validators.required]],
    isStop: [false],
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.dataExtras.isEdit) {
      this.stationForm.patchValue({
        latitude: this.dataExtras.dynamicData.latitude,
        longitude: this.dataExtras.dynamicData.longitude,
        isStop: this.dataExtras.dynamicData.isStop,
        name: this.dataExtras.dynamicData.name,
        address: this.dataExtras.dynamicData.address,
      });
    }
  }
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

    if (this.config.data.isEdit) {
      this.stationService.update(this.dataExtras.dynamicData.uuid, station).subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.stationForm.reset();
            this.ref.close(DialogResponse.UPDATE);
            break;
        }
      });
      return;
    }

    this.stationService.create(station).subscribe((event: any) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
          break;
        case HttpEventType.Response:
          this.stationForm.reset();
          this.ref.close(DialogResponse.CREATE);
          break;
      }
    });

  }


}
