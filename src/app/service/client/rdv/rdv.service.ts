import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
    private dataRDVurl = environment.baseUrl + "/client/rdv/allData";
    private newRDVurl = environment.baseUrl + "/client/rdv/newRDV";

    constructor(private http: HttpClient) { }

    getDataForRDV(): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.dataRDVurl, { headers });
    }

    newRDV(idVoiture:string, idService:string, details:any[], dates:Date[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        console.log(details);

        return this.http.post(this.newRDVurl, { idVoiture, idService, details, dates}, { headers });
    }
}
