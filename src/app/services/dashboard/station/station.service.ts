import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Constant} from "@app/shared/utils/constant/constant";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {Station} from "@app/models/dashboard/station";
import {Direction} from "@app/models/dashboard/direction";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private readonly http = inject(HttpClient);
  private readonly url: string = Constant.BASE_URL + 'coordinates';

  allCoordinates(): Observable<Root<Station[]>> {
    return this.http.get<Root<Station[]>>(this.url);
  }
  coordinates(page:number=1,perPage:number=10): Observable<Root<Station[]>> {
    return this.http.get<Root<Station[]>>(this.url+'?page='+page+'&perPage='+perPage);
  }

  create(station:any): Observable<HttpEvent<Root<Station>>> {
    return this.http.post<Root<Station>>(this.url, station, {reportProgress: true, observe: 'events'});
  }

  findOne(uuid: string): Observable<Root<Station>> {
    return this.http.get<Root<Station>>(this.url + '/' + uuid);
  }

  update(uuid:string, station:any): Observable<HttpEvent<Root<Station>>> {
    return this.http.put<Root<Station>>(this.url+'/'+uuid, station, {reportProgress: true, observe: 'events'});
  }

  delete(uuid:string): Observable<HttpEvent<Root<Station>>> {
    return this.http.delete<Root<Station>>(this.url+'/'+uuid, {reportProgress: true, observe: 'events'});
  }

  createMany(coordinates: number[][]): Observable<HttpEvent<any>> {
    return this.http.post<Root<Station[]>>(this.url+'/many', coordinates, {reportProgress: true, observe: 'events'});
  }

  findOneByLatLng(latLng: string): Observable<Root<Station>> {
    return this.http.get<Root<Station>>(this.url + '/latlng/' + latLng);
  }
}
