import { Component, OnInit } from '@angular/core';
import { VehiculeService } from '../../../service/client/vehicule/vehicule.service';
import { Table, TableModule } from 'primeng/table';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ManagerService } from '../../../service/manager/manager.service';

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
  selector: 'app-vehicule',
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
        ConfirmDialogModule
  ],
  templateUrl: './vehicule.component.html',
  styleUrl: './vehicule.component.scss'
})
export class VehiculeComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';
  updateDialog: boolean = false;

  selectedProducts: { _id: string, name: string }[] = [];

  cols!: Column[];

  nbVehicules: number = 0;

  loading: boolean = false;

  vehicules: any[] = [];

  vehiculeCliquer: any = {};

  newVehicleDialog: boolean = false;

  submitted: boolean = false;

  marques: any[] = [];

  vehiculeInsert: {
    marque: string,
    matricule: string,
    modele: string,
    annee: number,
} = {
        marque: '',
        matricule: '',
        modele: '',
        annee: 0,
    };

  constructor(
    private vehiculeService: VehiculeService,
    private managerService: ManagerService,
  ) {}

  ngOnInit() {
    this.loadVehiculeUtilisateur();
    this.loadMarque();
    console.log("vehicules",this.vehicules);
  }

  loadVehiculeUtilisateur(event: any | null = null): void {
    const page = event ? event.first / event.rows : 1;
    this.vehicules = [];
    this.vehiculeService.loadVehiculeUser().subscribe({
      next: (data: any) => {
        this.vehicules = data;
        this.nbVehicules = data.length;
      },
      error: (err) => console.error("Erreur lors de la connexion: ",err)
    })
  }

  loadMarque() {
    this.managerService.getListMarque(1).subscribe({
      next:(data) => {
        this.marques = data.marques
      },
      error:(error) => console.error("error fetching data",error)
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openUpdateDialog(vehicule: any) {
    this.vehiculeCliquer = JSON.parse(JSON.stringify(vehicule));
    this.updateDialog = true;
  }

  hideDialog() {
        this.updateDialog = false;
        this.submitted = false;
  }

  hideNewVehicule() {
    this.newVehicleDialog = false;
    this.submitted = false;
  }

  openInsertNewVehicule() {
    this.submitted = false;
    this.newVehicleDialog = true;
  }

  closeFormVehicule() {
    this.submitted = false;
    this.newVehicleDialog = false;
  }

  insertVehicule() {
    if(!this.vehiculeInsert.marque || !this.vehiculeInsert.matricule || !this.vehiculeInsert.modele || !this.vehiculeInsert.annee) this.errorMessage = "Veuillez completer tous les champs";
    this.vehiculeService.createNewVehicule(this.vehiculeInsert.marque,this.vehiculeInsert.matricule,this.vehiculeInsert.modele,this.vehiculeInsert.annee).subscribe({
      next: () => {
        this.closeFormVehicule();
        this.loadVehiculeUtilisateur();
      },
      error: (err) => console.error("Erreur lors de la creation du vehicule",err)
    })
  }

}
