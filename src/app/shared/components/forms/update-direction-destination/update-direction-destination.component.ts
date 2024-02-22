import {Component, EventEmitter, inject, Input, OnInit, Output, signal} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Direction} from "@app/models/dashboard/direction";
import {HttpEventType} from "@angular/common/http";
import {DirectionService} from "@app/services/dashboard/direction/direction.service";
import {Root} from "@app/models/root";
import {StationService} from "@app/services/dashboard/station/station.service";
import {MessageService} from "primeng/api";
import {DialogResponse} from "@app/models/dialog-response";

@Component({
  selector: 'app-update-direction-destination-form',
  standalone: true,
    imports: [
        AsyncPipe,
        PaginatorModule,
        ReactiveFormsModule
    ],
  templateUrl: './update-direction-destination.component.html',
  styleUrl: './update-direction-destination.component.css'
})
export class UpdateDirectionDestinationComponent implements OnInit {

  @Input() direction: Direction | undefined;
  @Output() formResponse = new EventEmitter<Root<Direction>>();

  private readonly fb = inject(FormBuilder);
  private readonly stationService = inject(StationService);
  private readonly directionService = inject(DirectionService);
  private readonly messageService = inject(MessageService);

  protected stations$ = signal(this.stationService.allCoordinates());

  protected directionForm = this.fb.group({
    departure: [''],
    arrival: [''],
    arrival_coordinate_uuid: [''],
    departure_coordinate_uuid: ['']
  });

  ngOnInit() {
    this.directionForm.patchValue({
      departure: this.direction?.departure?? '',
      arrival: this.direction?.arrival?? '',
      arrival_coordinate_uuid: this.direction!.arrival_coordinate_uuid,
      departure_coordinate_uuid: this.direction!.departure_coordinate_uuid
    });
  }

  onSubmit() {
    if (this.directionForm.invalid){
      return;
    }
    const direction = {
      departure: this.directionForm.value.departure!,
      arrival: this.directionForm.value.arrival!,
      geometry_uuid: this.direction!.geometry_uuid,
      coordinate_uuid: this.direction!.coordinate_uuid!,
      arrival_coordinate_uuid: this.directionForm.value.arrival_coordinate_uuid!,
      departure_coordinate_uuid: this.directionForm.value.departure_coordinate_uuid!,
      assignedBy: this.direction!.assignedBy!,
    };

    this.directionForm.disabled;

    this.directionService.update(this.direction!.uuid, direction).subscribe((event: any) => {
      this.directionForm.enabled;
      switch (event.type) {
        case HttpEventType.Response:
          this.messageService.add({severity:'success', summary:'Success', detail:`${DialogResponse.UPDATE}`});
          if (event.body!.status === 200){
            this.formResponse.emit(event.body);
          }
          break;
      }
    });
  }

}
