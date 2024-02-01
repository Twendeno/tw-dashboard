import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Constant} from "@app/shared/utils/constant/constant";
import {Direction} from "@app/models/dashboard/direction";
import {Root} from "@app/models/root";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  private readonly http = inject(HttpClient);
  private readonly url: string = Constant.BASE_URL + 'coordinate-polygon';

  directions(page:number=1,perPage:number=10): Observable<Root<Direction[]>> {
    return this.http.get<Root<Direction[]>>(this.url+'?page='+page+'&perPage='+perPage);
  }

  create(direction:any): Observable<HttpEvent<Root<Direction>>> {
    return this.http.post<Root<Direction>>(this.url, direction, {reportProgress: true, observe: 'events', responseType: 'json'});
  }

  update(uuid:string,direction:any): Observable<HttpEvent<Root<Direction>>> {
    return this.http.put<Root<Direction>>(this.url+'/'+uuid, direction, {reportProgress: true, observe: 'events', responseType: 'json'});
  }

  delete(uuid:string): Observable<HttpEvent<Root<Direction>>> {
    return this.http.delete<Root<Direction>>(this.url+'/'+uuid, {reportProgress: true, observe: 'events', responseType: 'json'});
  }
}