import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {District} from "@app/models/dashboard/district";
import {environment} from "@env/environment";
import {Direction} from "@app/models/dashboard/direction";

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private readonly http = inject(HttpClient);
  private readonly url: string = `${environment.MS_RX_API.URL}${environment.MS_RX_API.VERSION}/`+ 'districts';

  allDistricts(): Observable<Root<District[]>> {
    return this.http.get<Root<District[]>>(this.url);
  }

  districts(page: number=1, perPage: number=10): Observable<Root<District[]>> {
    return this.http.get<Root<District[]>>(this.url + '?page=' + page + '&perPage=' + perPage);
  }

  create(district: any): Observable<HttpEvent<Root<District>>> {
    return this.http.post<Root<District>>(this.url, district, {reportProgress: true, observe: 'events'});
  }

  update(uuid: string, district: any): Observable<HttpEvent<Root<District>>> {
    return this.http.put<Root<District>>(this.url + '/' + uuid, district, {reportProgress: true, observe: 'events'});
  }

  delete(uuid: string): Observable<HttpEvent<Root<District>>> {
    return this.http.delete<Root<District>>(this.url + '/' + uuid,{reportProgress: true, observe: 'events'});
  }
  deleteMany(data:District[]): Observable<HttpEvent<Root<District>>> {
    return this.http.delete<Root<District>>(this.url+'/deletes/districts', {body: data,reportProgress: true, observe: 'events', responseType: 'json'});
  }
}
