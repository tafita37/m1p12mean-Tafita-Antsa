import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private listServiceUrl = environment.baseUrl + "/services";

  constructor(private http: HttpClient) { }

  loadService(): Observable<any[]> {
    const data = this.http.get<any[]>(this.listServiceUrl);
    return data;
  }

}
