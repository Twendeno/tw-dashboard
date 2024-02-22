import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TimeLineComponent} from "@app/shared/components/time-line/time-line.component";
import {AsyncPipe, JsonPipe, UpperCasePipe} from "@angular/common";
import {HttpEventType} from "@angular/common/http";
import {ReplaySubject, takeUntil} from "rxjs";
import {DirectionService} from "@app/services/dashboard/direction/direction.service";
import {Direction} from "@app/models/dashboard/direction";
import {Title} from "@angular/platform-browser";
import {
  UpdateDirectionDestinationComponent
} from "@app/shared/components/forms/update-direction-destination/update-direction-destination.component";
import {Root} from "@app/models/root";

@Component({
  selector: 'app-detail-line',
  standalone: true,
  imports: [
    TimeLineComponent,
    AsyncPipe,
    JsonPipe,
    UpdateDirectionDestinationComponent,
    UpperCasePipe
  ],
  templateUrl: './detail-line.component.html',
  styleUrl: './detail-line.component.css'
})
export class DetailLineComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly directionService = inject(DirectionService);
  protected readonly geometryUuid = this.route.snapshot.paramMap.get('uuid');

  private readonly destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  protected direction: Direction | undefined;
  protected isShowForm = false;

  constructor() {
    inject(Title).setTitle(`Detail Line | ${this.geometryUuid}`);
  }

  ngOnInit() {
    this.directionService.direction(this.geometryUuid!)
      .pipe(takeUntil(this.destroy))
      .subscribe((event)=>{
        switch (event.type) {
          case HttpEventType.Response:
            this.direction = event.body!.data;
            break;
        }
      });
  }

  onResponseForm(direction:Root<Direction>){
    this.isShowForm = false;
    this.direction = direction.data;
  }

  onShowForm(){
    this.isShowForm = !this.isShowForm;
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
