import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DepartmentService} from "@app/services/dashboard/department/department.service";
import {StationService} from "@app/services/dashboard/station/station.service";
import {TownService} from "@app/services/dashboard/town/town.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HttpEventType} from "@angular/common/http";
import {DialogResponse} from "@app/models/dialog-response";
import {DistrictService} from "@app/services/dashboard/district/district.service";

@Component({
  selector: 'app-district-form',
  standalone: true,
    imports: [
        AsyncPipe,
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './district-form.component.html',
  styleUrl: './district-form.component.css'
})
export class DistrictFormComponent implements OnInit{

  private readonly townService = inject(TownService);
  private readonly districtService = inject(DistrictService);

  townService$ = this.townService.allTowns();
  districts$ = this.districtService.allDistricts();

  private readonly fb = inject(FormBuilder);

  private geoJsonFromFile: any = { "message": 'hello Twendeno 🫵🫵🫵' }

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  dataExtras = this.config.data;

  districtForm = this.fb.group({
    name: ['', [Validators.required]],
    assignedBy: ['admin'],
    lastModifiedBy : ['admin'],
    area: [0],
    town_uuid: ['',[Validators.required]],
    geodata:['']
  });


  ngOnInit(): void {
    if (this.dataExtras.isEdit) {
      this.districtForm.patchValue({
        name: this.dataExtras.dynamicData.name,
        area: this.dataExtras.dynamicData.area,
        assignedBy: this.dataExtras.dynamicData.assignedBy,
        lastModifiedBy: this.dataExtras.dynamicData.lastModifiedBy,
        town_uuid: this.dataExtras.dynamicData.town_uuid,
        geodata: this.dataExtras.dynamicData.geodata
      });
    }
  }

  onSubmit() {
    if (this.districtForm.invalid) {
      return;
    }

    this.districtForm.value.geodata = JSON.stringify(this.geoJsonFromFile)

    console.log(this.districtForm.value)

    if (this.dataExtras.isEdit) {
      this.districtService
        .update(this.dataExtras.dynamicData.uuid, this.districtForm.value)
        .subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
              break;
            case HttpEventType.Response:
              this.districtForm.reset();
              this.ref.close(DialogResponse.UPDATE);
              break;
            case HttpEventType.ResponseHeader:
              break;
          }
        });
      return;
    }

    this.districtService
      .create(this.districtForm.value)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.districtForm.reset();
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
    return this.districtForm.get('name')!;
  }

}
