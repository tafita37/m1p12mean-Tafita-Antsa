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
    private planningMecanicienUrl = environment.baseUrl + "/mecanicien/rdv/getPlanning";
    private statPerfMecanicienUrl = environment.baseUrl + "/mecanicien/rdv/getStatPerformance";
    private statInterventionMecanicienUrl = environment.baseUrl + "/mecanicien/rdv/getStatIntervention";
    private statEtoileMecanicienUrl = environment.baseUrl + "/mecanicien/rdv/getStatEtoile";
    private planningMecanicienAValiderUrl = environment.baseUrl + "/manager/mecanicien/listeTacheAValider";
    private planningOfDemandeUrl = environment.baseUrl + "/client/rdv/planningOfDemande";
    private planningMecanicienUpdateUrl = environment.baseUrl + "/mecanicien/rdv/updatePlanning";
    private noterPlanningUrl = environment.baseUrl + "/client/rdv/noterPlanning";
    private planningMecanicienValiderUrl = environment.baseUrl + "/manager/mecanicien/validerPlanning";

    constructor(private http: HttpClient) { }

    getDataForRDV(): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.dataRDVurl, { headers });
    }

    getPlanningMecanicien(numPage:Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenMecanicienStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.planningMecanicienUrl + "?page=" + numPage, { headers });
    }

    getStatMecanicienPerformance(anneeIntervention:Number, anneeEtoile : Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenMecanicienStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(
            this.statPerfMecanicienUrl + "?anneeIntervention=" + anneeIntervention+"&anneeEtoile="+anneeEtoile, { headers }
        );
    }

    getStatMecanicienEtoile(anneeEtoile : Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenMecanicienStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(
            this.statEtoileMecanicienUrl + "?anneeEtoile="+anneeEtoile, { headers }
        );
    }

    getStatMecanicienIntervention(anneeIntervention:Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenMecanicienStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(
            this.statInterventionMecanicienUrl + "?anneeIntervention=" + anneeIntervention, { headers }
        );
    }

    getPlanningOfMecanicienAValider(numPage:Number, idMecanicien : string | null): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.get(
            this.planningMecanicienAValiderUrl + "?page=" + numPage + "&idMecanicien=" + idMecanicien, { headers }
        );
    }

    getPlanningOfDemande(idDemande : string|null): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.planningOfDemandeUrl + "?idDemande=" + idDemande, { headers });
    }

    newRDV(idVoiture: string, idService: string, details: any[], dates: string[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        console.log(details);

        return this.http.post(this.newRDVurl, { idVoiture, idService, details, dates }, { headers });
    }

    updatePlanning(idPlanning: string, tempsPasse : number, resteAFaire : number): Observable<any> {
        const token = localStorage.getItem(environment.tokenMecanicienStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.planningMecanicienUpdateUrl, { idPlanning, tempsPasse, resteAFaire }, { headers });
    }

    validerPlanning(idPlanning: string, tempsPasse : number, resteAFaire : number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.planningMecanicienValiderUrl, { idPlanning, tempsPasse, resteAFaire }, { headers });
    }

    noterPlanning(idPlanning: string, nbEtoile:number): Observable<any> {
        const token = localStorage.getItem(environment.tokenClientStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.noterPlanningUrl, { idPlanning, nbEtoile }, { headers });
    }

    validerRDV(idDemande: string | null, planning: any[], listeAVendre : any): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.validerRDVUrl, { idDemande, planning, listeAVendre }, { headers });
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
