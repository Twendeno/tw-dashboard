import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Constant} from "@app/shared/utils/constant/constant";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {District} from "@app/models/dashboard/district";

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private readonly http = inject(HttpClient);
  private readonly url: string = Constant.BASE_URL + 'districts';

  allDistricts(): Observable<Root<District[]>> {
    return this.http.get<Root<District[]>>(this.url);
  }

  districts(page: number, perPage: number): Observable<Root<District[]>> {
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
}
