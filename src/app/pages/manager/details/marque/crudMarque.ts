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
import { ProductService } from '../../../service/product.service';
import { ManagerService, UserInterface } from '../../../../service/manager/manager.service';
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
    selector: 'app-crud-marque',
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
    templateUrl: './crudMarque.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CRUDMarque implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    newMarqueDialog: boolean = false;
    updateMarqueDialog: boolean = false;
    nomMarqueInsert: string = '';
    marqueCliquer: { nom: string, idMarque: string } = { nom: '', idMarque: '' };
    marques: [] = [];

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

    isLoading: boolean = false;


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

    nbMarque: number = 0;

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
        this.marques = [];
        this.managerService.getListMarque(page).subscribe(data => {
            this.marques = data.marques;
            this.nbMarque = data.nbMarque;
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

    openInsertNewMarque() {
        this.nomMarqueInsert = "";
        this.submitted = false;
        this.newMarqueDialog = true;
    }

    openUpdateMarque(marque: any) {
        this.marqueCliquer.idMarque = marque._id;
        this.marqueCliquer.nom = marque.nom;
        this.submitted = false;
        this.updateMarqueDialog = true;
    }


    typeOf(user: any): string {
        return typeof user; // Cela retournera 'object' si c'est un objet, 'string', 'number', etc.
    }

    validerInscription(user: any) {
        this.userCliquer = JSON.parse(JSON.stringify(user));
        this.roleUserCliquer = JSON.parse(JSON.stringify(user.role));
        this.validerUser.typeClient = this.userCliquer.client.typeClient;
        this.newMarqueDialog = true;
    }

    insertMarque() {
        this.isLoading = true;
        if (!this.nomMarqueInsert) {
            this.errorMessage = "Le nom de la marque est obligatoire";
            this.isLoading = false;
        } else {
            this.managerService.insertMarque(
                this.nomMarqueInsert
            ).subscribe({
                next: (data) => {
                    this.hideNewMarqueDialog();     // Fermer le dialogue après le succès
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

    updateMarque() {
        this.isLoading = true;
        if (!this.marqueCliquer.idMarque || !this.marqueCliquer.nom) {
            this.errorMessage = "Veuillez indiquer la marque que vous souhaitez modifier";
            this.isLoading = false;
        } else {
            this.managerService.updateMarque(
                this.marqueCliquer.idMarque,
                this.marqueCliquer.nom
            ).subscribe({
                next: (data) => {
                    this.hideUpdateMarqueDialog();     // Fermer le dialogue après le succès
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
            message: 'Etes vous sur de vouloir supprimer ces pièces ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                const ids = this.selectedProducts.map(product => product._id);
                this.managerService.deleteMarque(
                    ids
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        // this.hideDialog();     // Fermer le dialogue après le succès
                        this.loadData();       // Recharger les données après le succès
                        this.isLoading = false;
                    },
                    error: (error) => {
                        alert(error.error.message);
                        console.error('Erreur lors de la connexion:', error);
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    hideNewMarqueDialog() {
        this.newMarqueDialog = false;
        this.submitted = false;
    }

    hideUpdateMarqueDialog() {
        this.updateMarqueDialog = false;
        this.submitted = false;
    }

    deleteMarque(marque: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + marque.nom + '?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                this.managerService.deleteMarque(
                    [marque._id]
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        this.loadData();       // Recharger les données après le succès
                        this.isLoading = false;
                    },
                    error: (error) => {
                        alert(error.error.message);
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
        for (let i = 0; i < this.marques.length; i++) {
            if (this.marques[i]["_id"] === id) {
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
