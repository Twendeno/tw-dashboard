import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {Geometry} from "@app/models/dashboard/geometry";
import {Constant} from "@app/shared/utils/constant";

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  private readonly http = inject(HttpClient);
  private readonly url: string = Constant.BASE_URL + 'geometries';

  get geometries(): Observable<Root<Geometry[]>>{
    return this.http.get<Root<Geometry[]>>(this.url);
  }

  create(name:string, type:string): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.post<Root<Geometry>>(this.url, {name, type}, {reportProgress: true, observe: 'events'});
  }
}
