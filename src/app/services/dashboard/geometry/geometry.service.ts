import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {Geometry} from "@app/models/dashboard/geometry";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  private readonly http = inject(HttpClient);
  private readonly url: string = `${environment.MS_RX_API.URL}${environment.MS_RX_API.VERSION}/`+ 'geometries';

  allGeometries(): Observable<Root<Geometry[]>>{
    return this.http.get<Root<Geometry[]>>(this.url);
  }
  geometries(page:number=1,perPage:number=10): Observable<Root<Geometry[]>>{
    return this.http.get<Root<Geometry[]>>(this.url+'?page='+page+'&perPage='+perPage);
  }

  create(geometry:any): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.post<Root<Geometry>>(this.url, geometry, {reportProgress: true, observe: 'events'});
  }

  update(uuid:string,geometry:any): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.put<Root<Geometry>>(this.url+'/'+uuid, geometry, {reportProgress: true, observe: 'events'});
  }

  delete(uuid:string): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.delete<Root<Geometry>>(this.url+'/'+uuid, {reportProgress: true, observe: 'events'});
  }
  deleteMany(data:Geometry[]): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.delete<Root<Geometry>>(this.url+'/deletes/geometries', {body: data,reportProgress: true, observe: 'events', responseType: 'json'});
  }

  geometry(uuid:string): Observable<HttpEvent<Root<Geometry>>> {
    return this.http.get<Root<Geometry>>(this.url+'/'+uuid, {reportProgress: true, observe: 'events'});
  }
}
