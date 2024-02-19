import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {Department} from "@app/models/dashboard/department";
import {environment} from "@env/environment";
import {Direction} from "@app/models/dashboard/direction";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private readonly http = inject(HttpClient);
  private readonly url: string = `${environment.MS_RX_API.URL}${environment.MS_RX_API.VERSION}/`+ 'departments';

  allDepartments():Observable<Root<Department[]>>{
    return this.http.get<Root<Department[]>>(this.url);
  }

  departments(page:number=1,perPage:number=10): Observable<Root<Department[]>>{
    return this.http.get<Root<Department[]>>(this.url+'?page='+page+'&perPage='+perPage);
  }

  create(department:any): Observable<HttpEvent<Root<Department>>> {
    return this.http.post<Root<Department>>(this.url, department, {reportProgress: true, observe: 'events'});
  }

  update(uuid:string,department:any): Observable<HttpEvent<Root<Department>>> {
    return this.http.put<Root<Department>>(this.url+'/'+uuid, department, {reportProgress: true, observe: 'events'});
  }

  delete(uuid:string): Observable<HttpEvent<Root<Department>>> {
    return this.http.delete<Root<Department>>(this.url+'/'+uuid, {reportProgress: true, observe: 'events'});
  }
  deleteMany(data:Department[]): Observable<HttpEvent<Root<Department>>> {
    return this.http.delete<Root<Department>>(this.url+'/deletes/departments', {body: data,reportProgress: true, observe: 'events', responseType: 'json'});
  }


}
