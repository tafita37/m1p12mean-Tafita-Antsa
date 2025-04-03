import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { AppointmentService } from '../../../service/manager/appointment/appointment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../service/manager/user/user.service';
import { DropdownModule } from 'primeng/dropdown';
import { PlanningService } from '../../../service/manager/planning/planning.service';
import { switchMap } from 'rxjs';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-appointment',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    MessageModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    DropdownModule
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
  providers: [MessageService]
})
export class AppointmentComponent implements OnInit {
  errorMessage: string = '';
  sucessMessage: string = '';
  updateDialog: boolean = false;
  rejectDialog: boolean = false;
  
  appointments: any[] = [];
  mecaniciens: any[] = [];
  nbrAppointment = 0;
  selectedAppointment: any;

  
  roleUserCliquer: any = {};
  maxDate: Date = new Date();
  dateEmbauche: Date | null = null;
  minDate: Date = new Date('2000-01-01');
  selectedProducts: { _id: string, name: string }[] = [];
  submitted: boolean = false;
  statuses!: any[];

  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];
  nbUser: number = 0;
  loading: boolean = false;
  
  rejectForm: FormGroup;
  assignMechanicForm: FormGroup;

  // Nouveaux états pour l'acceptation
acceptDialog = false;
selectedMechanic: any;

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private planningService: PlanningService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.rejectForm = this.fb.group({
      reason: ['', Validators.required]
    });

    this.assignMechanicForm = this.fb.group({
      mechanic: [null, Validators.required] 
  });
  
  

  }

  ngOnInit(): void {
    this.loadPendingAppointment();
    this.loadMechanic();
  }

  loadPendingAppointment() {
    this.loading = true;
    this.appointmentService.getPendingAppointment().subscribe({
      next: (data: any) => {
        this.appointments = data.data;
        this.nbrAppointment = data.count;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec du chargement des rendez-vous'
        });
      }
    });
  }

  loadMechanic() {
    this.userService.getAllUser().subscribe({
      next: (data: any) => {
        this.mecaniciens = data.users.filter((user: any) => user.role.nom === "Mécanicien");
      },
      error: (err) => {
        console.error("Erreur lors du chargement des mécaniciens", err);
      }
    });
  }
  

  openRejectDialog(appointment: any) {
    this.selectedAppointment = appointment;
    this.rejectForm.reset();
    this.rejectDialog = true;
  }

  confirmReject() {
    if (this.rejectForm.invalid) {
      this.rejectForm.markAllAsTouched();
      return;
    }

    const rejectionData = {
      appointmentId: this.selectedAppointment._id,
      status: 'rejeté',
      motif: this.rejectForm.value.reason
    };

    console.log('rejection data',rejectionData);

    this.appointmentService.rendezvousrejete(rejectionData.appointmentId,rejectionData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Rendez-vous rejeté avec succès'
        });
        this.rejectDialog = false;
        this.loadPendingAppointment();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec du rejet du rendez-vous'
        });
      }
    });
  }


openAcceptDialog(appointment: any) {
  this.selectedAppointment = appointment;
  this.selectedMechanic = null;
  this.acceptDialog = true;
}

onMechanicSelected(mechanic: any) {
  console.log("Mécanicien sélectionné :", mechanic);
  this.selectedMechanic = mechanic;
}



confirmAccept() {
  if (!this.selectedMechanic) {
      this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Veuillez sélectionner un mécanicien'
      });
      return;
  }

  const acceptanceData = {
      appointmentId: this.selectedAppointment._id,
      status: 'accepté',
      mechanicId: this.selectedMechanic._id
  };

  const planningData = {
    appointment: this.selectedAppointment._id,
    mechanic: this.selectedMechanic._id,
    date: this.selectedAppointment.dateRdv
  };

  console.log("planning data",planningData);


  this.appointmentService.rendezvousAccepte(acceptanceData.appointmentId, acceptanceData.status)
  .pipe(
    switchMap(() => this.planningService.createNewPlanning(planningData)) // Enchaîne avec la création du planning
  )
  .subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Rendez-vous accepté et planning mis à jour avec succès'
      });
      this.acceptDialog = false;
      this.loadPendingAppointment();
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Échec de l\'acceptation du rendez-vous ou de la création du planning'
      });
      console.error("Erreur lors du traitement :", err);
    }
  });




}

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}