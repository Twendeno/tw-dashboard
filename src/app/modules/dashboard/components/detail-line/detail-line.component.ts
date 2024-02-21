import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TimeLineComponent} from "@app/shared/components/time-line/time-line.component";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {HttpEventType} from "@angular/common/http";
import {ReplaySubject, takeUntil} from "rxjs";
import {DirectionService} from "@app/services/dashboard/direction/direction.service";
import {Geometry} from "@app/models/dashboard/geometry";
import { RequestQueueService } from '@app/services/request-queue/request-queue.service';
import {Direction} from "@app/models/dashboard/direction";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-detail-line',
  standalone: true,
  imports: [
    TimeLineComponent,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './detail-line.component.html',
  styleUrl: './detail-line.component.css'
})
export class DetailLineComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly directionService = inject(DirectionService);
  protected readonly geometryUuid =  this.route.snapshot.paramMap.get('uuid');

  private readonly destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  protected direction : Direction | undefined ;

  constructor() {
    inject(Title).setTitle(`Detail Line | ${this.geometryUuid}`);
  }
  ngOnInit() {
    this.directionService.direction(this.geometryUuid!)
      .pipe(takeUntil(this.destroy))
      .subscribe((event)=>{
        switch (event.type) {
          case HttpEventType.Response:
            this.direction = event.body?.data;
            break;
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
