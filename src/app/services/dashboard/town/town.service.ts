import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Constant} from "@app/shared/utils/constant/constant";
import {Observable} from "rxjs";
import {Root} from "@app/models/root";
import {Town} from "@app/models/dashboard/town";

@Injectable({
  providedIn: 'root'
})
export class TownService {

  private readonly http = inject(HttpClient);
  private readonly url: string = Constant.BASE_URL + 'towns';

  allTowns(): Observable<Root<Town[]>>{
    return this.http.get<Root<Town[]>>(this.url);
  }

  towns(page:number=1,perPage:number=10): Observable<Root<Town[]>>{
    return this.http.get<Root<Town[]>>(this.url+'?page='+page+'&perPage='+perPage);
  }

  create(town:any): Observable<HttpEvent<Root<Town>>> {
    return this.http.post<Root<Town>>(this.url, town, {reportProgress: true, observe: 'events'});
  }

  update(uuid:string,town:any): Observable<HttpEvent<Root<Town>>> {
    return this.http.put<Root<Town>>(this.url+'/'+uuid, town, {reportProgress: true, observe: 'events'});
  }

  delete(uuid:string): Observable<HttpEvent<Root<Town>>> {
    return this.http.delete<Root<Town>>(this.url+'/'+uuid, {reportProgress: true, observe: 'events'});
  }

}