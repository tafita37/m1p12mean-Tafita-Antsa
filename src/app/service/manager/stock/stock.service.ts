import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StockService {
    private listeStockUrl = environment.baseUrl + "/manager/piece/stock/allDataStock";
    private newMouvementStockUrl = environment.baseUrl + "/manager/piece/stock/insert";

    getListStock(numPage: Number, date:Date): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(this.listeStockUrl + "?page=" + numPage+"&date="+date, { headers });
    }

    newMouvementStock(
        idPiece: string,
        idMarque: string,
        idUser: string,
        idFournisseur: string | null,
        prix: number,
        nb: number,
        isEntree: boolean,
        dateMouvement : Date
    ): Observable<any> {
        const token = localStorage.getItem(environment.tokenManagerStorage);
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(
            this.newMouvementStockUrl,
            { idPiece, idMarque, idUser, idFournisseur, prix, nb, isEntree, dateMouvement },
            { headers }
        );
    }

    constructor(private http: HttpClient) { }
}
