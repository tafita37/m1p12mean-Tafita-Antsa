import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ServicesService } from '../../../service/client/services/services.service';
import { VehiculeService } from '../../../service/client/vehicule/vehicule.service';
import { RendezVousService } from '../../../service/client/rendezVous/rendezVous.service';

interface Service {
  _id: string;
  nom: string;
  prestations: Prestation[];
  selected: boolean;
}

interface Prestation {
  _id: string;
  nom: string;
  products: DetailPiece[];
  selected: boolean;
}

interface DetailPiece {
  _id: string;
  piece: Piece;
  marque: Marque;
  selected: boolean;
}

interface Piece {
  _id: string;
  nom: string;
}

interface Marque {
  _id: string;
  nom: string
}

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepperModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    CardModule,
    InputTextModule
  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  currentStep = 1;
  minDate = new Date();
  appointmentDate: Date | null = null;

  vehicles : any[] = [];

  services: Service[] = [];
  filteredServices: Service[] = [];
  filteredProducts: DetailPiece[] = [];

  selectedVehicle: any = null; 

  private service = inject(ServicesService);
  private vehicule = inject(VehiculeService);
  private rendezVous = inject(RendezVousService);

  ngOnInit(): void {
    this.loadServices();
    this.loadVehiculeUser();
  }

  loadVehiculeUser() {
    this.vehicule.loadVehiculeUser().subscribe({ 
      next: (data: any) => {
        this.vehicles = data;
      },
      error: (err) => console.error("Erreur lord de la recupation des donnees",err)
    })
  }


  loadServices() {
    this.service.loadService().subscribe({
      next: (data: any) => {
        this.services = data.data.map((service: any) => ({
          _id: service._id,
          nom: service.nom,
          selected: false,
          prestations: service.prestations.map((prestation: any) => ({
            _id: prestation._id,
            nom: prestation.nom,
            selected: false,
            products: prestation.detailPieces.map((piece: any) => ({
              _id: piece._id,
              piece: piece.piece,
              marque: piece.marque,
              selected: false
            }))
          }))
        }));
      },
      error: (err) => console.error("Erreur lors de la récupération des services", err)
    });
  }

  updateServices() {
    this.filteredServices = this.services.filter(service => service.selected);
  }

  updatePrestations() {
    this.filteredProducts = [];

    this.filteredServices.forEach(service => {
      service.prestations.forEach(prestation => {
        if (prestation.selected) {
          prestation.products.forEach(piece => {
            this.filteredProducts.push(piece); 
          });
        }
      });
    });

    console.log("🔍 Produits après mise à jour:", this.filteredProducts);
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.appointmentDate !== null && this.services.some(service => service.selected) && this.selectedVehicle;
      case 2:
        return this.filteredServices.some(service => service.prestations.some(prestation => prestation.selected));
      default:
        return true;
    }
  }

  canSubmit() {
    return this.currentStep === 3 && this.filteredProducts.some(prod => prod.selected);
  }

  nextStep() {
    if (this.currentStep < 3 && this.canProceed()) {
      this.currentStep++;
      if (this.currentStep === 3) {
        this.updatePrestations(); 
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  confirmBooking() {
    const selectedServices = this.filteredServices.filter(service => service.selected);
    const selectedPrestations = selectedServices.flatMap(service => 
      service.prestations.filter(prestation => prestation.selected)
    );

    const formattedDate = this.appointmentDate ? new Date(this.appointmentDate) : null;

    if (!formattedDate) {
        alert("Veuillez sélectionner une date valide.");
        return;
    }
    const booking = {
        type: 'standard',  
        vehiculeId: this.selectedVehicle,
        dateRdv: formattedDate.toISOString(),
        prestations: selectedPrestations.map(prestation => ({
            prestationId: prestation._id, 
            pieces: prestation.products
                .filter(prod => prod.selected)
                .map(prod => (prod._id)) 
        })),
        notes: "" 
    };


    this.rendezVous.creationRendezVous(booking).subscribe({
        next: response => {
            alert("Votre réservation a été confirmée !");
        },
        error: err => {
            alert("Erreur lors de la réservation, veuillez réessayer.");
        }
    });
}

  
}
