import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
    private loginUserClientUrl = environment.baseUrl + "/auth/loginUserClient";
    private loginUserMecanicienUrl = environment.baseUrl + "/auth/loginUserMecanicien";
    private loginManagerUrl = environment.baseUrl + "/auth/loginManager";
    private registerUserClientUrl = environment.baseUrl + "/auth/registerUserClient";
    private registerUserMecanicienUrl = environment.baseUrl + "/auth/registerUserMecanicien";
    constructor(private http: HttpClient) { };

    loginUserClient(user: any): Observable<any> {
        return this.http.post(this.loginUserClientUrl, user);
    }

    loginUserMecanicien(user: any): Observable<any> {
        return this.http.post(this.loginUserMecanicienUrl, user);
    }

    loginManager(manager: any): Observable<any> {
        return this.http.post(this.loginManagerUrl, manager);
    }

    signUpUserClient(user: any): Observable<any> {
        return this.http.post(this.registerUserClientUrl, user);
    }

    signUpUserMecanicien(user: any): Observable<any> {
        return this.http.post(this.registerUserMecanicienUrl, user);
    }
}
