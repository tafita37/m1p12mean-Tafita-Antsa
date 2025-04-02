import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { RdvService } from '../../../service/rdv/rdv.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-empty',
    standalone: true,
    imports: [
        ToolbarModule,
        FullCalendarModule,
        ButtonModule,
        DialogModule,
        SelectModule,
        InputNumberModule,
        MessageModule,
        InputTextModule,
        ConfirmDialogModule,
        MultiSelectModule,
        SelectModule,
        FormsModule,
        CommonModule,
        CalendarModule
        // FullCalendarComponent
    ],
    templateUrl: "./rdv.html"
})
export class RDV {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    allVoitures: any[] = [];
    allServices: any[] = [];
    allSousServices: any[] = [];
    listQuantite: any[] = [];
    sousSelected: any[] = [];
    idVoitureInsert: string = "";
    _idServiceInsert: string = "";
    showSousService: boolean = false;
    selectedDates: Date[] = [];
    nbDate: number = 1;
    plannings: any[] = [];

    get idServiceInsert(): string {
        return this._idServiceInsert;
    }

    set idServiceInsert(value: string) {
        this._idServiceInsert = value;
        this.allServices.filter(service => {
            if (service._id === this._idServiceInsert) {
                this.allSousServices = service.sousServices;
            }
        });
        for (let i = 0; i < this.allSousServices.length; i++) {
            this.allSousServices[i].isSelected = false;
            this.listQuantite[this.allSousServices[i]._id] = null;
        }
    }

    onMultiselectChange(event: any) {
        // 1. Cloner le tableau pour forcer la détection de changement
        this.allSousServices = [...this.allSousServices];

        // 2. Mettre à jour isSelected en comparant les _id
        const selectedIds = new Set(this.sousSelected);
        var totalDureeMinute = 0;
        this.allSousServices.forEach(sous => {
            sous.isSelected = selectedIds.has(sous._id);
            if (sous.isSelected) {
                totalDureeMinute += sous.dureeMinute;
            }
        });
        var totalDureeHeure = totalDureeMinute / 60;
        var totalDureeJour = Math.ceil(totalDureeHeure / 24);
        this.nbDate = totalDureeJour;
    }

    insertDialog: boolean = false;

    errorMessage: string = "";

    hideNewRdvDialog() {
        this.insertDialog = false;
    }

    insertRDV() {
        if (
            !this.idVoitureInsert ||
            !this.idServiceInsert ||
            !this.sousSelected ||
            !this.listQuantite ||
            !this.selectedDates
        ) {
            this.errorMessage = "Veuillez compléter tout les champs";
            console.log("to");

            return;
        }
        let details: any[] = [];
        console.log(this.sousSelected, this.listQuantite, this.sousSelected.length);

        for (let i = 0; i < this.sousSelected.length; i++) {
            if (this.listQuantite[this.sousSelected[i]] === null || this.listQuantite[this.sousSelected[i]] === 0) {
                this.errorMessage = "Quantité incorrect";
                return;
            }
            details.push({
                sousService: this.sousSelected[i],
                qte: this.listQuantite[this.sousSelected[i]]
            })
        }
        this.selectedDates;
        this.rdvService.newRDV(
            this.idVoitureInsert,
            this.idServiceInsert,
            details,
            this.selectedDates
        ).subscribe({
            next: (data) => {
                this.hideNewRdvDialog();
                this.loadData();       // Recharger les données après le succès
            },
            error: (error) => {
                console.error('Erreur lors de la connexion:', error);
            }
        });
    }

    openNewRdvDialog() {
        this.insertDialog = true;
    }

    // Lorsqu'on clique sur un jour, on passe à la vue journalière
    onDateClick(info: any) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.changeView('timeGridDay', info.dateStr);
    }

    goToMonthView() {
        // Revenir à la vue mensuelle
        let calendarApi = this.calendarComponent.getApi();
        calendarApi.changeView('dayGridMonth');
    }

    onEventClick(info: any) {
        if (confirm(`Supprimer l'événement "${info.event.title}" ?`)) {
            // info.event.remove();
        }
    }

    onEventDrop(info: any) {
        alert(`Événement déplacé à : ${info.event.start}`);
    }

    onEventResize(info: any) {
        alert(`Nouvelle durée : ${info.event.start} - ${info.event.end}`);
    }

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth', // Vue mensuelle par défaut
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        editable: true,
        selectable: true,
        timeZone: 'local',
        // events: this.plannings,
        // events: [
        //     { title: 'Réunion', start: '2025-04-03T10:00:00', end: '2025-04-03T11:00:00' }
        // ],
        dateClick: this.onDateClick.bind(this), // Gère le clic sur un jour
        eventClick: this.onEventClick.bind(this)
    };

    constructor(private rdvService: RdvService) { }

    loadData(): void {
        this.allVoitures = [];
        this.rdvService.getDataForRDV().subscribe(data => {
            this.allVoitures = data.listVoiture;
            this.allServices = data.allService;
            let allPlanning = data.allPlanning;
            for (let i = 0; i < allPlanning.length; i++) {
                let dateHeureDebut = new Date(allPlanning[i].dateHeureDebut);
                let dateHeureFin = new Date(dateHeureDebut);
                dateHeureFin.setMinutes(dateHeureFin.getMinutes() + allPlanning[i].estimationTotal);
                this.plannings.push(
                    {
                        title: allPlanning[i].sousService.nom +
                                " par " +
                                allPlanning[i].mecanicien.user.nom +
                                " " +
                                allPlanning[i].mecanicien.user.prenom,
                        start: dateHeureDebut.toISOString().replace('Z', ''),
                        end: dateHeureFin.toISOString().replace('Z', '')
                    }
                )
            }
            this.calendarOptions = { ...this.calendarOptions, events: [...this.plannings] };
            console.log(this.calendarOptions);

        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }


    ngOnInit(): void {
        this.loadData();
    }
}
