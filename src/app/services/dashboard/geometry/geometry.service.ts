import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {Geometry} from "@app/models/dashboard/geometry";
import {Constant} from "@app/shared/utils/constant/constant";

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  private readonly http = inject(HttpClient);
  private readonly url: string = Constant.BASE_URL + 'geometries';

  allGeometries(): Observable<Root<Geometry[]>>{
    return this.http.get<Root<Geometry[]>>(this.url);
  }
  geometries(page:number=1,perPage:number=10): Observable<Root<Geometry[]>>{
    return this.http.get<Root<Geometry[]>>(this.url+'?page='+page+'&perPage='+perPage);
  }

  create(name:string, type:string,geodata:string): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.post<Root<Geometry>>(this.url, {name, type, geodata}, {reportProgress: true, observe: 'events'});
  }

  update(uuid:string,name:string, type:string,geodata:string): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.put<Root<Geometry>>(this.url+'/'+uuid, {name, type, geodata}, {reportProgress: true, observe: 'events'});
  }

  delete(uuid:string): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.delete<Root<Geometry>>(this.url+'/'+uuid, {reportProgress: true, observe: 'events'});
  }
}
