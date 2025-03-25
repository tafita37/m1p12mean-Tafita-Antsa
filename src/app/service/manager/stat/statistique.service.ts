import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
    private statCAUrl = environment.baseUrl + "/manager/stat/statCA";

    constructor(private http: HttpClient) { }

    getAllStat(anneeStat : number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.statCAUrl +"?anneeCA="+anneeStat, { headers });
    }
}
