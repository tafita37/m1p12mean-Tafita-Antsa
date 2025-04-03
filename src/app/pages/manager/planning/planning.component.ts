import { Component, OnInit } from '@angular/core';
import { addDays, format, startOfWeek, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PlanningService } from '../../../service/manager/planning/planning.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  currentDate = new Date();
  weekDays: Date[] = [];
  selectedMechanics: string[] = [];
  selectedSlot: any = null;

  mechanics: any[] = [];
  appointments: any[] = [];
  planning: any[] = [];

  constructor(
    private planningService: PlanningService,
  ) {}

  ngOnInit() {
    this.loadPlanning();
    this.generateWeekDays();
  }

  loadPlanning() {
    this.planningService.getAllPlanning().subscribe({
      next: (data) => {
        this.planning = data;
        this.mechanics = this.extractUniqueMechanics(data);
        this.selectedMechanics = this.mechanics.map(m => m._id);
        this.appointments = this.transformPlanningData(data);
      },
      error: (err) => console.error("Error loading planning", err)
    });
  }

  private extractUniqueMechanics(data: any[]): any[] {
    const mechanicsMap = new Map<string, any>();

    data.forEach(item => {
      if (item.mechanic && !mechanicsMap.has(item.mechanic._id)) {
        mechanicsMap.set(item.mechanic._id, {
          _id: item.mechanic._id,
          nom: item.mechanic.nom,
          prenom: item.mechanic.prenom,
          fullName: `${item.mechanic.nom} ${item.mechanic.prenom}`,
          color: this.generateColor(item.mechanic._id)
        });
      }
    });

    return Array.from(mechanicsMap.values());
  }

  private transformPlanningData(data: any[]): any[] {
    return data.map(item => {
      // Extraire les noms des prestations
      const prestationNames = item.appointment.prestations
        ?.map((p: any) => p.prestationId?.nom || 'Prestation inconnue')
        ?.join(', ') || 'Aucune prestation';

      // Informations sur le véhicule
      const vehicle = item.appointment.vehiculeId;
      const vehicleInfo = vehicle
        ? `${vehicle.modele} (${vehicle.matricule})`
        : 'Véhicule inconnu';

      return {
        _id: item._id,
        mechanicId: item.mechanic._id,
        mechanicName: `${item.mechanic.nom} ${item.mechanic.prenom}`,
        prestations: prestationNames,
        date: parseISO(item.date),
        status: item.appointment.status,
        type: item.appointment.type,
        vehicle: vehicleInfo,
        appointmentDetails: item.appointment,
        originalData: item // Conserver les données originales au cas où
      };
    });
  }

  private generateColor(id: string): string {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c', '#d35400'];
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  }

  // ... (le reste des méthodes reste inchangé)
  toggleMechanic(mechanicId: string) {
    const index = this.selectedMechanics.indexOf(mechanicId);
    if (index === -1) {
      this.selectedMechanics.push(mechanicId);
    } else {
      this.selectedMechanics.splice(index, 1);
    }
  }

  getPrestationNames(prestations: any[]): string {
    if (!prestations || prestations.length === 0) {
      return 'Aucune prestation';
    }

    return prestations
      .map(p => p.prestationId?.nom || 'Prestation inconnue')
      .join(', ');
  }

  get currentWeekLabel(): string {
    const start = this.weekDays[0];
    const end = this.weekDays[this.weekDays.length - 1];
    return `${format(start, 'dd MMMM', { locale: fr })} - ${format(end, 'dd MMMM yyyy', { locale: fr })}`;
  }

  generateWeekDays() {
    const start = startOfWeek(this.currentDate, { weekStartsOn: 1 });
    this.weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  formatDay(date: Date): string {
    return format(date, 'EEEE dd', { locale: fr });
  }

  formatModalDate(date: Date): string {
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
  }

  previousWeek() {
    this.currentDate = addDays(this.currentDate, -7);
    this.generateWeekDays();
  }

  nextWeek() {
    this.currentDate = addDays(this.currentDate, 7);
    this.generateWeekDays();
  }

  hasAppointment(day: Date): boolean {
    return this.getAppointments(day).length > 0;
  }

  getAppointments(day: Date): any[] {
    return this.appointments.filter(appointment =>
      format(appointment.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
      this.selectedMechanics.includes(appointment.mechanicId)
    );
  }

  getMechanicColor(mechanicId: string): string {
    return this.mechanics.find(m => m._id === mechanicId)?.color || '#999';
  }

  getMechanicName(mechanicId: string): string {
    const mechanic = this.mechanics.find(m => m._id === mechanicId);
    return mechanic ? `${mechanic.nom} ${mechanic.prenom}` : 'Inconnu';
  }

  onSlotClick(day: Date) {
    this.selectedSlot = { date: day };
  }

  closeModal() {
    this.selectedSlot = null;
  }
}
