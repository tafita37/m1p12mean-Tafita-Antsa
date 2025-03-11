import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
    private loginUserClientUrl = environment.baseUrl + "/auth/loginUserClient";
    private loginManagerUrl = environment.baseUrl + "/auth/loginManager";
    private registerUserClientUrl = environment.baseUrl + "/auth/registerUserClient";
    constructor(private http: HttpClient) { };

    loginUser(user: any): Observable<any> {
        return this.http.post(this.loginUserClientUrl, user);
    }

    loginManager(manager: any): Observable<any> {
        return this.http.post(this.loginManagerUrl, manager);
    }

    signUpUser(user: any): Observable<any> {
        return this.http.post(this.registerUserClientUrl, user);
    }
}
