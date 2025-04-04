import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProductService } from '../../../../service/product.service';
import { ClientService } from '../../../../../service/client/client.service';
import { ActivatedRoute } from '@angular/router';
import { FactureService } from '../../../../../service/client/facture/facture.service';

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
    selector: 'app-historique-voiture',
    standalone: true,
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
    templateUrl: './historiqueVoiture.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class HistoriqueVoiture implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    updateDialog: boolean = false;
    insertDialog: boolean = false;
    idVoiture: string | null = "";
    listeDemande: [] = [];
    allMarques: [] = [];

    voitureInsert: {
        matricule: string, marque: string, anneeFabrication: number
    } = { matricule: '', marque: '', anneeFabrication: new Date().getFullYear() };

    typeClients: [] = [];

    dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    calendarValue: any = null;

    voitureUpdate: {
        idVoiture : string, matricule: string, marque: string, anneeFabrication: number
    } = { idVoiture : '', matricule: '', marque: '', anneeFabrication: new Date().getFullYear() };

    otherDataCliquer: {typeClient : string|null, dateEmbauche : Date|null} = {typeClient : null, dateEmbauche : null};

    validerUser: { idUser: string; typeClient: string | null; dateEmbauche: Date | null } = {
        idUser: "",
        typeClient: null,
        dateEmbauche: null
    };


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

    nbHistorique: number = 0;

    loading: boolean = false;

    voitureConcerner : any = {};

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private clientService: ClientService,
        private route: ActivatedRoute,
        private factureService : FactureService
        private route : ActivatedRoute
    ) { }

    exportCSV() {
        this.dt.exportCSV();
    }

    exportPdf(demande: any) {
        this.factureService.getFactureOfDemande(demande._id).subscribe({
            next: (pdfBlob: Blob) => {
                // Créer un lien de téléchargement
                const url = window.URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `facture-${demande._id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    // exportPdf(demande : any) {
    //     this.factureService.getFactureOfDemande(demande._id).subscribe(data => {
    //         console.log(data);
    //     }, error => {
    //         console.error('Erreur lors de la connexion:', error);
    //     });
    // }

    loadData(event: any | null = null): void {
        const page = event ? (event.first / event.rows)+1 : 1;
        this.listeDemande = [];
        this.typeClients = [];
        this.clientService.getHistoriqueVoiturePaginate(page, this.idVoiture).subscribe(data => {
            console.log(data);
            this.voitureConcerner=data.voiture;
            this.listeDemande =data.demandes;
            this.nbHistorique = data.nbHistorique;
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    ngOnInit(): void {
        this.idVoiture=this.route.snapshot.paramMap.get('idVoiture');
        this.loadData();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.submitted = false;
        this.updateDialog = true;
    }

    typeOf(user: any): string {
        return typeof user; // Cela retournera 'object' si c'est un objet, 'string', 'number', etc.
    }

    openUpdateDialog(voiture: any) {
        this.voitureUpdate.idVoiture = voiture._id;
        this.voitureUpdate.matricule = voiture.matricule;
        this.voitureUpdate.marque = voiture.marque._id;
        this.voitureUpdate.anneeFabrication = voiture.anneeFabrication;
        this.updateDialog = true;
    }

    openInsertDialog() {
        this.insertDialog = true;
        console.log(this.insertDialog);

    }

    insertVoiture() {
        if (!this.voitureInsert.matricule || !this.voitureInsert.marque || !this.voitureInsert.anneeFabrication) {
            this.errorMessage = "Veuillez remplir tous les champs";
        }  else {
            this.clientService.insertVoiture(
                this.voitureInsert.marque,
                this.voitureInsert.matricule,
                this.voitureInsert.anneeFabrication
            ).subscribe({
                next: (data) => {
                    console.log(data.message);
                    this.hideDialog();     // Fermer le dialogue après le succès
                    this.loadData();       // Recharger les données après le succès
                },
                error: (error) => {
                    console.error('Erreur lors de la connexion:', error);
                }
            });
        }
    }

    updateVoiture() {
        if (
            !this.voitureUpdate.idVoiture ||
            !this.voitureUpdate.matricule ||
            !this.voitureUpdate.marque ||
            !this.voitureUpdate.anneeFabrication
        ) {
            this.errorMessage = "Veuillez remplir tous les champs";
        } else {
            this.clientService.updateVoiture(
                this.voitureUpdate.idVoiture,
                this.voitureUpdate.marque,
                this.voitureUpdate.matricule,
                this.voitureUpdate.anneeFabrication
            ).subscribe({
                next: (data) => {
                    console.log(data.message);
                    this.hideDialog();     // Fermer le dialogue après le succès
                    this.loadData();       // Recharger les données après le succès
                },
                error: (error) => {
                    console.error('Erreur lors de la connexion:', error);
                }
            });
        }
    }


    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedProducts.map(product => product._id);
                this.clientService.deleteVoitures(
                    ids
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        // this.hideDialog();     // Fermer le dialogue après le succès
                        this.loadData();       // Recharger les données après le succès
                    },
                    error: (error) => {
                        alert(error.error.message);
                        console.error('Erreur lors de la connexion:', error);
                    }
                });
            }
        });
    }

    hideDialog() {
        this.updateDialog = false;
        this.submitted = false;
    }

    hideNewVoitureDialog() {
        this.insertDialog = false;
        this.submitted = false;
    }

    deleteProduct(voiture: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + voiture.matricule + '?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.clientService.deleteVoitures(
                    [voiture._id]
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        this.hideDialog();     // Fermer le dialogue après le succès
                        this.loadData();       // Recharger les données après le succès
                    },
                    error: (error) => {
                        console.error('Erreur lors de la connexion:', error);
                    }
                });
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.listeDemande.length; i++) {
            if (this.listeDemande[i]["_id"] === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    saveProduct() {
        this.submitted = true;
    }
}
