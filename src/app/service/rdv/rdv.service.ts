import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RdvService {
    private dataRDVurl = environment.baseUrl + "/client/rdv/allData";
    private newRDVurl = environment.baseUrl + "/client/rdv/newRDV";
    private listRDVNVUrl = environment.baseUrl + "/manager/rdv/allRdvNV";
    private allDataValidationUrl = environment.baseUrl + "/manager/rdv/allDataValidation";
    private validerRDVUrl = environment.baseUrl + "/manager/rdv/validerRDV";
    private refuserRDVUrl = environment.baseUrl + "/manager/rdv/refuserRDV";

    constructor(private http: HttpClient) { }

    getDataForRDV(): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.dataRDVurl, { headers });
    }

    newRDV(idVoiture: string, idService: string, details: any[], dates: Date[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        console.log(details);

        return this.http.post(this.newRDVurl, { idVoiture, idService, details, dates }, { headers });
    }

    validerRDV(idDemande:string|null, planning : any[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.validerRDVUrl, { idDemande, planning }, { headers });
    }

    refuserRDV(idDemande:string|null): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.refuserRDVUrl, { idDemande }, { headers });
    }

    getRDVNv(numPage: Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listRDVNVUrl + "?page=" + numPage, { headers });
    }

    getAllDataForValidation(idDemande: string|null): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.allDataValidationUrl + "?idDemande=" + idDemande, { headers });
    }
}
