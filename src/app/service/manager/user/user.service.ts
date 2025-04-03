import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private listUser = environment.baseUrl + "/user/allUser";

  constructor(
    private http: HttpClient
  ) { }


  getAllUser(): Observable<any> {
    const data = this.http.get<any[]>(this.listUser);
    return data;
  }
}
