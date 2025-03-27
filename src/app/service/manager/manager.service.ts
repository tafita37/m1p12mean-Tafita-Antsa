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
    private listeUserPagineUrl = environment.baseUrl + "/manager/user/allUser";
    private validerUserInscriptionUrl = environment.baseUrl + "/manager/validerInscription";
    private refuserUserInscriptionUrl = environment.baseUrl + "/manager/refuserInscription";
    private listPiecePaginateUrl = environment.baseUrl + "/manager/piece/allPiece";
    private listDetailPiecePaginateUrl = environment.baseUrl + "/manager/piece/details/allDetailPiece";
    private listFournisseurPaginateUrl = environment.baseUrl + "/manager/fournisseur/allFournisseur";
    private listMarquePaginateUrl = environment.baseUrl + "/manager/marque/allMarque";
    private ajoutPieceUrl = environment.baseUrl + "/manager/piece/insert";
    private ajoutPieceDetailUrl = environment.baseUrl + "/manager/piece/details/insert";
    private ajoutFournisseurUrl = environment.baseUrl + "/manager/fournisseur/insert";
    private ajoutMarqueUrl = environment.baseUrl + "/manager/marque/insert";
    private updatePieceUrl = environment.baseUrl + "/manager/piece/update";
    private updateDetailPieceUrl = environment.baseUrl + "/manager/piece/details/update";
    private updateFournisseurUrl = environment.baseUrl + "/manager/fournisseur/update";
    private updateMarqueUrl = environment.baseUrl + "/manager/marque/update";
    private deletePieceUrl = environment.baseUrl + "/manager/piece/delete";
    private deleteUserUrl = environment.baseUrl + "/manager/user/delete";
    private deleteDetailPieceUrl = environment.baseUrl + "/manager/piece/details/delete";
    private deleteFournisseurUrl = environment.baseUrl + "/manager/fournisseur/delete";
    private deleteMarqueUrl = environment.baseUrl + "/manager/marque/delete";

    constructor(private http: HttpClient) { };

    getListUserUnvalidate(numPage : Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listeUserNotValiderUrl+"?page="+numPage, { headers });
    }

    getListUser(numPage : Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listeUserPagineUrl +"?page="+numPage, { headers });
    }

    getListPiece(numPage: Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listPiecePaginateUrl + "?page=" + numPage, { headers });
    }

    getListDetailPiece(numPage: Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listDetailPiecePaginateUrl + "?page=" + numPage, { headers });
    }

    getListFournisseur(numPage: Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listFournisseurPaginateUrl + "?page=" + numPage, { headers });
    }

    getListMarque(numPage: Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listMarquePaginateUrl + "?page=" + numPage, { headers });
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

    insertDetailPiece(idPiece : string, idMarque : string, prixAchat : number, prixVente : Number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.ajoutPieceDetailUrl, { idPiece, idMarque, prixAchat, prixVente }, { headers });
    }

    insertFournisseur(nom : string, contact : string, email : string): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.ajoutFournisseurUrl, {nom, contact, email }, { headers });
    }

    insertMarque(nom : String): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.ajoutMarqueUrl, { nom }, { headers });
    }

    updatePiece(idPiece: string, nom: string): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updatePieceUrl, { idPiece, nom }, { headers });
    }

    updateDetailPiece(idDetailPiece : string, prixAchat: number, prixVente: number): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(
            this.updateDetailPieceUrl,
            { idDetailPiece: idDetailPiece, prixAchat: prixAchat, prixVente: prixVente },
            { headers }
        );
    }

    updateFournisseur(idFournisseur : string, nom : string, contact : string, email : string): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(
            this.updateFournisseurUrl,
            { idFournisseur, nom, contact, email },
            { headers }
        );
    }

    updateMarque(idMarque: string, nom: string): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.updateMarqueUrl, { idMarque, nom }, { headers });
    }

    deletePiece(idPieces: string[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.deletePieceUrl, { idPieces }, { headers });
    }

    deleteUsers(idUsers: string[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.deleteUserUrl, { idUsers }, { headers });
    }

    deleteDetailPiece(idDetailPieces: string[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.deleteDetailPieceUrl, { idDetailPieces }, { headers });
    }

    deleteFournisseur(idFournisseurs: string[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.deleteFournisseurUrl, { idFournisseurs }, { headers });
    }

    deleteMarque(idMarques: string[]): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.deleteMarqueUrl, { idMarques }, { headers });
    }

    refuserInscription(idUser: string): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(this.refuserUserInscriptionUrl, { idUser }, { headers });
    }

}
