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
import { ManagerService } from '../../../../../service/manager/manager.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    selector: 'app-crud-fournisseur',
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
        ConfirmDialogModule,
        ProgressSpinnerModule
    ],
    templateUrl: './crudFournisseur.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CRUDFournisseur implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    newFournisseurDialog: boolean = false;
    updatePieceDialog: boolean = false;
    nomPieceInsert: string = '';
    pieceCliquer: { nom: string, idPiece: string } = { nom: '', idPiece: '' };
    fournisseurs: [] = [];
    allMarques: [] = [];
    allPieces: [] = [];
    fournisseurInsert : { nom: string, email: string, contact: string } = { nom: '', email: '', contact: '' };
    fournisseurModif: {
        idFournisseur: string, nom: string, email: string, contact: string
    } = { idFournisseur: "", nom: '', email: '', contact: '' };

    isLoading: boolean = false;

    dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    calendarValue: any = null;

    userCliquer: any = {};

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

    nbFournisseur: number = 0;

    loading: boolean = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private managerService: ManagerService
    ) { }

    exportCSV() {
        this.dt.exportCSV();
    }

    loadData(event: any | null = null): void {
        var page = 1;
        if (event) {
            page = (event.first / event.rows)+1;
        }
        this.fournisseurs = [];
        this.managerService.getListFournisseur(page).subscribe(data => {
            this.fournisseurs = data.fournisseur;
            this.nbFournisseur = data.nbFournisseur;
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openInsertNewFournisseur() {
        this.errorMessage = "";
        this.nomPieceInsert = "";
        this.submitted = false;
        this.newFournisseurDialog = true;
    }

    openUpdateFournisseur(fournisseur: any) {
        this.errorMessage = "";
        this.fournisseurModif.idFournisseur = fournisseur._id;
        this.fournisseurModif.nom = fournisseur.nom;
        this.fournisseurModif.email = fournisseur.email;
        this.fournisseurModif.contact = fournisseur.contact;
        this.submitted = false;
        this.updatePieceDialog = true;
    }


    typeOf(user: any): string {
        return typeof user; // Cela retournera 'object' si c'est un objet, 'string', 'number', etc.
    }

    validerInscription(user: any) {
        this.userCliquer = JSON.parse(JSON.stringify(user));
        this.roleUserCliquer = JSON.parse(JSON.stringify(user.role));
        this.validerUser.typeClient = this.userCliquer.client.typeClient;
        this.newFournisseurDialog = true;
    }

    insertFournisseur() {
        this.isLoading = true;
        if (!this.fournisseurInsert.nom || !this.fournisseurInsert.email || !this.fournisseurInsert.contact) {
            this.errorMessage = "Vous n'avez pas remplis certains champs";
            this.isLoading = false;
        } else {
            this.managerService.insertFournisseur(
                this.fournisseurInsert.nom,
                this.fournisseurInsert.contact,
                this.fournisseurInsert.email
            ).subscribe({
                next: (data) => {
                    this.hideNewFournisseurDialog();     // Fermer le dialogue après le succès
                    this.loadData();       // Recharger les données après le succès
                    this.isLoading = false;
                },
                error: (error) => {
                    this.errorMessage = error.error.message;
                    console.error('Erreur lors de la connexion:', error);
                    this.isLoading = false;
                }
            });
        }
    }

    updateFournisseur() {
        this.isLoading = true;
        if (!this.fournisseurModif.idFournisseur || !this.fournisseurModif.nom || !this.fournisseurModif.email || !this.fournisseurModif.contact) {
            this.errorMessage = "Veuillez entrer les données corrects";
        } else {
            this.managerService.updateFournisseur(
                this.fournisseurModif.idFournisseur,
                this.fournisseurModif.nom,
                this.fournisseurModif.contact,
                this.fournisseurModif.email
            ).subscribe({
                next: (data) => {
                    this.hideUpdateDetailPieceDialog();     // Fermer le dialogue après le succès
                    this.loadData();       // Recharger les données après le succès
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Erreur lors de la connexion:', error);
                    this.isLoading = false;
                }
            });
        }
    }


    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Etes vous sur de vouloir supprimer ces fournisseurs ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                const ids = this.selectedProducts.map(product => product._id);
                this.managerService.deleteFournisseur(
                    ids
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        // this.hideDialog();     // Fermer le dialogue après le succès
                        this.loadData();       // Recharger les données après le succès
                        this.isLoading = false;
                    },
                    error: (error) => {
                        console.error('Erreur lors de la connexion:', error);
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    hideNewFournisseurDialog() {
        this.fournisseurInsert.contact = "";
        this.fournisseurInsert.email = "";
        this.fournisseurInsert.nom = "";
        this.newFournisseurDialog = false;
        this.submitted = false;
    }

    hideUpdateDetailPieceDialog() {
        this.updatePieceDialog = false;
        this.submitted = false;
    }

    deleteFournisseur(fournisseur: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + fournisseur.nom +'?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                this.managerService.deleteFournisseur(
                    [fournisseur._id]
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        this.loadData();       // Recharger les données après le succès
                        this.isLoading = false;
                    },
                    error: (error) => {
                        console.error('Erreur lors de la connexion:', error);
                        this.isLoading = false;
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
        for (let i = 0; i < this.fournisseurs.length; i++) {
            if (this.fournisseurs[i]["_id"] === id) {
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
