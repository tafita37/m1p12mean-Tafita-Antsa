import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
    private performanceMecanicienUrl = environment.baseUrl + "/manager/mecanicien/getPerformance";

    getAllPerformance(mois:number|null, annee:number|null): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.performanceMecanicienUrl, {mois, annee}, { headers });
    }

    constructor(private http: HttpClient) { }
}
