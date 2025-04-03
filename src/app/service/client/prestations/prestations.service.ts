import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestationsService {

  private listePrestationUrl = environment.baseUrl + "/prestations";

  constructor(private http: HttpClient) { }

  loadPrestations(): Observable<any[]> {
    return this.http.get<any[]>(this.listePrestationUrl);
  }

}
