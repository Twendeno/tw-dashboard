import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Constant} from "@app/shared/utils/constant";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {Station} from "@app/models/dashboard/station";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private readonly http = inject(HttpClient);
  private readonly url: string = Constant.BASE_URL + 'coordinates';

  get coordinates(): Observable<Root<Station[]>> {
    return this.http.get<Root<Station[]>>(this.url);
  }

  create(station:any): Observable<HttpEvent<Root<Station>>> {
    return this.http.post<Root<Station>>(this.url, station, {reportProgress: true, observe: 'events'});
  }

  findOne(uuid: string): Observable<Root<Station>> {
    return this.http.get<Root<Station>>(this.url + '/' + uuid);
  }
}
