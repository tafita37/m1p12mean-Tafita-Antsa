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
    selector: 'app-user-not-valider',
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
    templateUrl: './userNotValider.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class UserNotValider implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    validerInscriptionDialog: boolean = false;

    users: [] = [];

    typeClients: [] = [];

    dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    isLoading: boolean = false;

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

    selectedProducts!: UserInterface[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    nbNonValider: number = 0;

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
        const page = event ? (event.first / event.rows)+1 : 1;
        this.users = [];
        this.typeClients = [];
        this.managerService.getListUserUnvalidate(page).subscribe(data => {
            this.users = data.user;
            this.typeClients = data.typeClients;
            this.nbNonValider = data.nbUser;
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

    openNew() {
        this.userCliquer = {};
        this.submitted = false;
        this.validerInscriptionDialog = true;
    }

    typeOf(user: any): string {
        return typeof user; // Cela retournera 'object' si c'est un objet, 'string', 'number', etc.
    }

    validerInscription(user: any) {
        this.userCliquer = JSON.parse(JSON.stringify(user));
        this.roleUserCliquer = JSON.parse(JSON.stringify(user.role));
        this.validerUser.typeClient = this.userCliquer.client.typeClient;
        this.validerInscriptionDialog = true;
    }

    confirmerValidationInscription() {
        this.isLoading = true;
        this.validerUser.idUser = this.userCliquer._id;

        if (this.roleUserCliquer.niveau === 1 && this.validerUser.typeClient === null) {
            this.errorMessage = "Veuillez entrer le type de client";
            this.isLoading = false;
        } else if (this.roleUserCliquer.niveau === 10 && this.validerUser.dateEmbauche === null) {
            this.errorMessage = "Veuillez entrer la date d'embauche";
            this.isLoading = false;
        } else {
            this.managerService.validerInscription(
                this.validerUser.idUser,
                this.validerUser.typeClient,
                this.validerUser.dateEmbauche
            ).subscribe({
                next: (data) => {
                    console.log(data.message);
                    this.hideDialog();     // Fermer le dialogue après le succès
                    this.loadData();       // Recharger les données après le succès
                    this.isLoading = false;
                    this.validerUser= {
                        idUser: "",
                        typeClient: null,
                        dateEmbauche: null
                    };
                },
                error: (error) => {
                    console.error('Erreur lors de la connexion:', error);
                    this.isLoading = false;
                    this.validerUser = {
                        idUser: "",
                        typeClient: null,
                        dateEmbauche: null
                    };
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
                // this.users.set(this.users().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.validerInscriptionDialog = false;
        this.submitted = false;
    }

    deleteProduct(user: any) {
        this.isLoading = true;
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + user.nom + " " + user.prenom + '?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.managerService.refuserInscription(
                    user._id
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        this.hideDialog();     // Fermer le dialogue après le succès
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
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i]["_id"] === id) {
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
