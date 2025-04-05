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
        ConfirmDialogModule
    ],
    templateUrl: './crudUser.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CRUDUser implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    updateDialog: boolean = false;

    users: [] = [];

    typeClients: [] = [];

    dropdownValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    calendarValue: any = null;

    userCliquer: any = {};

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

    nbUser: number = 0;

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
        this.loading = true;
        const page = event ? (event.first / event.rows)+1 : 1;
        this.users = [];
        this.typeClients = [];
        this.managerService.getListUser(page).subscribe(data => {
            this.users = data.users;
            this.typeClients = data.typeClients;
            this.nbUser = data.nbUser;
            this.loading = false;
        }, error => {
            console.error('Erreur lors de la connexion:', error);
            this.loading = false;
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
        this.updateDialog = true;
    }

    typeOf(user: any): string {
        return typeof user; // Cela retournera 'object' si c'est un objet, 'string', 'number', etc.
    }

    openUpdateDialog(user: any) {
        this.userCliquer = JSON.parse(JSON.stringify(user));
        this.roleUserCliquer = JSON.parse(JSON.stringify(user.role));
        if (this.roleUserCliquer.niveau === 10) {
            this.otherDataCliquer.dateEmbauche = new Date(this.userCliquer.mecanicien.dateEmbauche);
        } else {
            this.otherDataCliquer.typeClient = this.userCliquer.client.typeClient;
        }

        this.updateDialog = true;
    }

    updateUser() {
        if (this.roleUserCliquer.niveau === 1 && this.otherDataCliquer.typeClient === null) {
            this.errorMessage = "Veuillez entrer le type de client";
        } else if (this.roleUserCliquer.niveau === 10 && this.otherDataCliquer.dateEmbauche === null) {
            this.errorMessage = "Veuillez entrer la date d'embauche";
        } else {
            this.managerService.updateUser(
                this.userCliquer._id,
                this.userCliquer.nom,
                this.userCliquer.prenom,
                this.userCliquer.email,
                this.otherDataCliquer
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
                this.managerService.deleteUsers(
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

    deleteProduct(user: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + user.nom + " " + user.prenom + '?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.managerService.deleteUsers(
                    [user._id]
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
