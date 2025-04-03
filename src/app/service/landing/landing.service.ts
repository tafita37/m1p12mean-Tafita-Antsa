import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingService {
    private listeDataUrl = environment.baseUrl +"/landing/allData";

    constructor(private http: HttpClient) { }

    getAllDatas(): Observable<any> {
        return this.http.get(this.listeDataUrl);
    }
}
