import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Constant} from "@app/shared/utils/constant/constant";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {Department} from "@app/models/dashboard/department";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private readonly http = inject(HttpClient);
  private readonly url: string = Constant.BASE_URL + 'departments';

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


}
