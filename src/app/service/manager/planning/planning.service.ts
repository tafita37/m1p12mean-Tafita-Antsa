import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  private listPlanning = environment.baseUrl+"/planning";
  private createPlanning = environment.baseUrl+"/planning";

  constructor(private http: HttpClient) { }

  getAllPlanning(): Observable<any[]> {
    return this.http.get<any[]>(this.listPlanning);
  }

  createNewPlanning(data: any) {
    return this.http.post(this.createPlanning,data);
  }

}
