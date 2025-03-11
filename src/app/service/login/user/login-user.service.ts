import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
    private loginUserClientUrl = environment.baseUrl + "/auth/loginUserClient";
    private registerUserClientUrl = environment.baseUrl + "/auth/registerUser";
    constructor(private http: HttpClient) { };

    loginUser(user: any): Observable<any> {
        return this.http.post(this.loginUserClientUrl, user);
    }

    signUpUser(user: any): Observable<any> {
        return this.http.post(this.registerUserClientUrl, user);
    }
}
