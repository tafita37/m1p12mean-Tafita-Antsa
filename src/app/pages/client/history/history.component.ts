import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { addDays, format, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-history',
  imports: [

  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  currentDate = new Date(2025, 1, 19);
  weekDays: Date[] = [];
  hours = Array.from({ length: 9 }, (_, i) => i + 8); // 8h à 17h
  selectedMechanics: number[] = [];
  selectedSlot: { date: Date; hour: number } | null = null;

  mechanics: any[] = [
    { id: 1, name: 'Jean Dupont', color: '#3498db' },
    { id: 2, name: 'Marie Martin', color: '#2ecc71' },
    { id: 3, name: 'Pierre Durant', color: '#e74c3c' },
    { id: 4, name: 'Sophie Bernard', color: '#9b59b6' },
    { id: 5, name: 'Lucas Petit', color: '#f1c40f' }
  ];

  appointments: any[] = [
    {
      id: 1,
      mechanicId: 1,
      title: 'Vidange - Renault Clio',
      start: new Date(2025, 1, 19, 9, 0),
      end: new Date(2025, 1, 19, 10, 0),
    },
    {
      id: 11,
      mechanicId: 2,
      title: 'Vidange - Kia pride',
      start: new Date(2025, 1, 19, 9, 0),
      end: new Date(2025, 1, 19, 10, 0),
    },
    {
      id: 12,
      mechanicId: 3,
      title: 'Vidange - Golf 5',
      start: new Date(2025, 1, 19, 9, 0),
      end: new Date(2025, 1, 19, 10, 0),
    },
    {
      id: 13,
      mechanicId: 4,
      title: 'Vidange - Toyota Hilux',
      start: new Date(2025, 1, 19, 9, 0),
      end: new Date(2025, 1, 19, 10, 0),
    },
    {
      id: 2,
      mechanicId: 2,
      title: 'Révision - Peugeot 308',
      start: new Date(2025, 1, 19, 14, 0),
      end: new Date(2025, 1, 19, 16, 0),
    },
    {
      id: 3,
      mechanicId: 3,
      title: 'Freins - BMW Serie 1',
      start: new Date(2025, 1, 20, 10, 0),
      end: new Date(2025, 1, 20, 12, 0),
    },
    {
      id: 4,
      mechanicId: 4,
      title: 'Diagnostic - Audi A3',
      start: new Date(2025, 1, 20, 13, 0),
      end: new Date(2025, 1, 20, 14, 0),
    },
    {
      id: 5,
      mechanicId: 5,
      title: 'Pneus - Mercedes Classe A',
      start: new Date(2025, 1, 21, 11, 0),
      end: new Date(2025, 1, 21, 12, 0),
    },
    {
      id: 6,
      mechanicId: 1,
      title: 'Climatisation - Fiat 500',
      start: new Date(2025, 1, 21, 15, 0),
      end: new Date(2025, 1, 21, 16, 0),
    },
    {
      id: 7,
      mechanicId: 2,
      title: 'Embrayage - Volkswagen Golf',
      start: new Date(2025, 1, 22, 8, 0),
      end: new Date(2025, 1, 22, 11, 0),
    },
    {
      id: 8,
      mechanicId: 3,
      title: 'Courroie - Opel Corsa',
      start: new Date(2025, 1, 22, 14, 0),
      end: new Date(2025, 1, 22, 16, 0),
    },
    {
      id: 9,
      mechanicId: 4,
      title: 'Batterie - Toyota Yaris',
      start: new Date(2025, 1, 23, 9, 0),
      end: new Date(2025, 1, 23, 10, 0),
    },
    {
      id: 10,
      mechanicId: 5,
      title: 'Échappement - Citroën C3',
      start: new Date(2025, 1, 23, 13, 0),
      end: new Date(2025, 1, 23, 15, 0),
    }
  ];

  ngOnInit() {
    this.generateWeekDays();
    // Par défaut, tous les mécaniciens sont sélectionnés
    this.selectedMechanics = this.mechanics.map(m => m.id);
  }

  toggleMechanic(mechanicId: number) {
    const index = this.selectedMechanics.indexOf(mechanicId);
    if (index === -1) {
      this.selectedMechanics.push(mechanicId);
    } else {
      this.selectedMechanics.splice(index, 1);
    }
  }

  get currentWeekLabel(): string {
    const start = this.weekDays[0];
    const end = this.weekDays[this.weekDays.length - 1];
    return `${format(start, 'dd MMMM', { locale: fr })} - ${format(end, 'dd MMMM yyyy', { locale: fr })}`;
  }

  generateWeekDays() {
    const start = startOfWeek(this.currentDate, { weekStartsOn: 1 }); // Utilisez startOfWeek de date-fns
    this.weekDays = Array.from({ length: 6 }, (_, i) => addDays(start, i));
  }

  formatDay(date: Date): string {
    return format(date, 'EEEE dd', { locale: fr });
  }

  formatModalDate(date: Date): string {
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
  }

  formatTime(date: Date): string {
    return format(date, 'HH:mm');
  }

  previousWeek() {
    this.currentDate = addDays(this.currentDate, -7);
    this.generateWeekDays();
  }

  nextWeek() {
    this.currentDate = addDays(this.currentDate, 7);
    this.generateWeekDays();
  }

  hasAppointment(day: Date, hour: number): boolean {
    return this.getAppointments(day, hour).some(apt =>
      this.selectedMechanics.includes(apt.mechanicId)
    );
  }

  getAppointments(day: Date, hour: number): any[] {
    return this.appointments.filter(appointment => {
      const appointmentHour = appointment.start.getHours();
      return format(appointment.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        && appointmentHour === hour;
    });
  }

  getMechanicColor(mechanicId: number): string {
    return this.mechanics.find(m => m.id === mechanicId)?.color || '#999';
  }

  getMechanicName(mechanicId: number): string {
    return this.mechanics.find(m => m.id === mechanicId)?.name || 'Inconnu';
  }

  onSlotClick(day: Date, hour: number) {
    this.selectedSlot = { date: day, hour };
  }

  closeModal() {
    this.selectedSlot = null;
  }
}
