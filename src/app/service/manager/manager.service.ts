import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoleInterface
 {
    _id?: string;
    nom?: string;
    niveau?: Number;
}

export interface UserInterface {
    _id?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    role?: RoleInterface;
}

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
    private listeUserNotValiderUrl = environment.baseUrl + "/manager/allUserNotValider";
    private validerUserInscriptionUrl = environment.baseUrl + "/manager/validerInscription";
    private refuserUserInscriptionUrl = environment.baseUrl + "/manager/refuserInscription";
    private listPiecePaginateUrl = environment.baseUrl + "/manager/piece/allPiece";
    private ajoutPieceUrl = environment.baseUrl + "/manager/piece/insert";
    private updatePieceUrl = environment.baseUrl + "/manager/piece/update";
    private deletePieceUrl = environment.baseUrl + "/manager/piece/delete";

    constructor(private http: HttpClient) { };

    getListUserUnvalidate(numPage : Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listeUserNotValiderUrl+"?page="+numPage, { headers });
    }

    getListPiece(numPage: Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listPiecePaginateUrl + "?page=" + numPage, { headers });
    }

    validerInscription(idUser: string, typeClient: string | null, dateEmbauche: Date | null): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.validerUserInscriptionUrl, { idUser, typeClient, dateEmbauche }, { headers });
    }

    insertPiece(nom : String): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.ajoutPieceUrl, { nom }, { headers });
    }

    updatePiece(idPiece: string, nom: string): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updatePieceUrl, { idPiece, nom }, { headers });
    }

    deletePiece(idPieces: string[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.deletePieceUrl, { idPieces }, { headers });
    }

    refuserInscription(idUser: string): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.refuserUserInscriptionUrl, { idUser }, { headers });
    }

}
