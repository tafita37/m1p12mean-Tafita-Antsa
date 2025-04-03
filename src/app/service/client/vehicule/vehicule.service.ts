import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  private listVehiculeUser = environment.baseUrl + "/vehicules/user";

  constructor(private http: HttpClient) { }

  getUserFromToken(token: string | null) {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      console.error('Invalid token format', e);
      return null;
    }
  }

  loadVehiculeUser(): Observable<any[]> {
    const token = localStorage.getItem(environment.tokenClientStorage);
    const id = this.getUserFromToken(token);
    const data = this.http.get<any[]>(this.listVehiculeUser+`/${id}`);
    return data;
  }

  getListVehicleUser(numPage: Number): Observable<any> {
    const token = localStorage.getItem(environment.tokenClientStorage);
    const id = this.getUserFromToken(token);
    return this.http.get(this.listVehiculeUser + "?page="+numPage);
  }

  deleteVehicule(id: any) {
    return {status: 1};
  }

}