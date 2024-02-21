import { Injectable } from '@angular/core';
import {concatMap, finalize, map, Observable, Subject, timer} from "rxjs";
import {request} from "express";

@Injectable({
  providedIn: 'root'
})
export class RequestQueueService {

  obsQueue = new Subject<Observable<any>>();
  obsQueueCount = 1;
  request: any;
  constructor() { }

  enqueue() {
    // const currentCount = this.obsQueueCount;
    const currentCount = request;
    console.log('[QUEUING]', currentCount)
    const subject = timer(1000).pipe(map(x => currentCount));
    this.obsQueue.next(subject)

    this.obsQueueCount++;
  }

  process() {
    console.log('PROCESSING QUEUE...')
    this.obsQueue
      .pipe(
        finalize(() => console.log('stopped processing queue')),
        concatMap(x =>{
console.log('[PROCESSING]', x)
          return x
        }))
      .subscribe(x => {
        console.log('[PROCESSED]', x)
      });
  }
}
