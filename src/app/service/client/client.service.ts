import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    private listeVoitureUrl = environment.baseUrl + "/client/voiture/allVoiture";
    private listeVoitureAvancementUrl = environment.baseUrl + "/client/rdv/voitureEnCours";
    private newVoitureUrl = environment.baseUrl + "/client/voiture/insert";
    private updateVoitureUrl = environment.baseUrl + "/client/voiture/update";
    private deleteVoitureUrl = environment.baseUrl + "/client/voiture/delete";
    private historiqueServiceVoitureUrl = environment.baseUrl + "/client/voiture/getHistoriqueOfVoiture";

    constructor(private http: HttpClient) { }

    getListeVoiturePaginate(numPage: Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listeVoitureUrl + "?page=" + numPage, { headers });
    }

    getHistoriqueVoiturePaginate(numPage: Number, idVoiture : string|null): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.historiqueServiceVoitureUrl + "?page=" + numPage+"&idVoiture="+idVoiture, { headers });
    }

    getListVoitureAvancement(): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listeVoitureAvancementUrl, { headers });
    }

    insertVoiture(marque:string, matricule:string, anneeFabrication:number): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.newVoitureUrl, { marque, matricule, anneeFabrication }, { headers });
    }

    updateVoiture(idVoiture : string, marque:string, matricule:string, anneeFabrication:number): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updateVoitureUrl, { idVoiture, marque, matricule, anneeFabrication }, { headers });
    }

    deleteVoitures(idVoitures: string[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.deleteVoitureUrl, { idVoitures }, { headers });
    }
}
