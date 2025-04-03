import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

    private insertionRendezVous = environment.baseUrl + "/rendezvous"

  constructor(private http: HttpClient) { }

  getUserFromToken(token: string | null) {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      console.error('Invalid token format', e);
      return null;
    }
  }

  creationRendezVous(booking: any) {

    const body: any = {
      type: booking.prestations && booking.prestations.length > 0 ? "standard" : "devis",
      vehiculeId: booking.vehiculeId,
      dateRdv: new Date(booking.dateRdv)// ✅ Correction : formatage en ISO
    };
  
    if (body.type === "standard") {
      body.prestations = booking.prestations.map((prestation: any) => ({
        prestationId: prestation.prestationId,
        pieces: prestation.pieces.map((piece: any) => ({ pieceId: piece })) // ✅ Correction du format des pièces
      }));
    } else if (booking.demandeDevis) {
      body.demandeDevis = booking.demandeDevis;
    }
  
    console.log("📤 Données envoyées à l'API :", body);
  
    return this.http.post<any>(this.insertionRendezVous, body);
  }
  

}
