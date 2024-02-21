import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, JsonPipe, NgClass, NgStyle, UpperCasePipe} from "@angular/common";
import {Geometry} from "@app/models/dashboard/geometry";
import {StationService} from "@app/services/dashboard/station/station.service";
import {Station} from "@app/models/dashboard/station";
import {toSignal} from "@angular/core/rxjs-interop";
import {ReplaySubject, takeUntil} from "rxjs";
import {Direction} from "@app/models/dashboard/direction";

@Component({
  selector: 'app-time-line',
  standalone: true,
  imports: [
    NgClass,
    JsonPipe,
    AsyncPipe,
    UpperCasePipe,
    NgStyle
  ],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.css'
})
export class TimeLineComponent implements OnInit, OnDestroy{
  @Input() timeLineData: Direction | undefined;

  protected readonly stationService = inject(StationService);
  private readonly destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  protected stations: Station[] = []
  ngOnInit() {
   this.timeLineData?.geometry.coordinates.forEach((coordinate:Station) => {
       this.stationService.findOne(coordinate.coordinate_uuid)
         .pipe(takeUntil(this.destroy))
         .subscribe((response)=>{
          this.stations.push(response.data);
       })
    });
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
