import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
    private statCAUrl = environment.baseUrl + "/manager/stat/statCA";
    private statPieceServiceUrl = environment.baseUrl + "/manager/stat/statPieceService";
    private statTopClientsUrl = environment.baseUrl + "/manager/stat/statTopClient";

    constructor(private http: HttpClient) { }

    getAllStat(anneeStat : number, anneeClient:number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.statCAUrl +"?anneeCA="+anneeStat+"&anneeClient="+anneeClient, { headers });
    }

    getStatTopClient(anneeClient:number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.statTopClientsUrl +"?anneeClient="+anneeClient, { headers });
    }

    getStatPieceService(anneeStat : number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.statPieceServiceUrl +"?anneeCA="+anneeStat, { headers });
    }
}
