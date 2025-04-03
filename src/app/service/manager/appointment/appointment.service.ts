import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private listAppointmentPending = environment.baseUrl + "/rendezvous/pending/list";
  private rejectAppointment =environment.baseUrl + "/rendezvous"
  private acceptAppointment = environment.baseUrl + "/rendezvous/accept"

  constructor(private http: HttpClient) { }


  getPendingAppointment(): Observable<any[]> {
    const data = this.http.get<any[]>(this.listAppointmentPending);
    return data;
  }

  rendezvousrejete(id: string, data: any): Observable<any> {
    return this.http.patch<any>(this.rejectAppointment+`/${id}`,data);
  }

  rendezvousAccepte(id: string, status: any): Observable<any> {
    const data = {status: status};
    return this.http.patch<any>(this.acceptAppointment+`/${id}`,data);
  }


}
