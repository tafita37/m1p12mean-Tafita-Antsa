import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
    private factureOfDemandeUrl = environment.baseUrl + "/client/rdv/pdfFacture";

    constructor(private http: HttpClient) { }

    getFactureOfDemande(idDemande : string): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.factureOfDemandeUrl + "?idDemande=" + idDemande, { headers, responseType: 'blob' });
    }

}
