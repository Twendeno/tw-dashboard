import {
  Component,
  inject,
  input,
  signal
} from '@angular/core';
import {GeometryType} from "@app/models/geometry-type";
import {GeometryService} from "@app/services/dashboard/geometry.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-line-list',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    ReactiveFormsModule
  ],
  templateUrl: './line-list.component.html',
  styleUrl: './line-list.component.css'
})
export class LineListComponent {

  geometryTypes = input([
      GeometryType.POINT, GeometryType.LINESTRING, GeometryType.POLYGON,
      GeometryType.MULTIPOINT, GeometryType.MULTILINESTRING, GeometryType.MULTIPOLYGON,
      GeometryType.GEOMETRYCOLLECTION, GeometryType.FEATURE, GeometryType.FEATURECOLLECTION
    ]
  );

  private readonly geometryService = inject(GeometryService);
  private readonly fb = inject(FormBuilder);
  geometryForm = this.fb.group({
    name: ['', [Validators.required]],
    type: ['', [Validators.required]]
  });

  geometries = signal(this.geometryService.geometries);

  onSubmit() {
    if (this.geometryForm.invalid) {
      return;
    }
    this.geometryService
      .create(this.geometryForm.value.name!, this.geometryForm.value.type!)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.geometryForm.reset();
            this.geometries.set(this.geometryService.geometries)
            break;
        }
      });
  }

  get name() {
    return this.geometryForm.get('name')!;
  }

  get type() {
    return this.geometryForm.get('type')!;
  }

}
