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
    selector: 'app-crud-detail-piece',
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
    templateUrl: './crudDetailPiece.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CRUDDetailsPiece implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    newPieceDetailDialog: boolean = false;
    updatePieceDialog: boolean = false;
    nomPieceInsert: string = '';
    pieceCliquer: { nom: string, idPiece: string } = { nom: '', idPiece: '' };
    detailPieces: [] = [];
    allMarques: [] = [];
    allPieces: [] = [];
    detailInsert: {
        idMarque: string, idPiece: string
    } = { idMarque: '', idPiece: '' };
    detailModif: {
        idDetailPiece : string
    } = { idDetailPiece: '' };
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

    nbDetailPiece: number = 0;

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
        var page = 1;
        if (event) {
            page = (event.first / event.rows)+1;
        }
        this.detailPieces = [];
        this.managerService.getListDetailPiece(page).subscribe(data => {
            this.detailPieces = data.detailPieces;
            this.nbDetailPiece = data.nbDetailsPiece;
            this.allMarques = data.marques;
            this.allPieces = data.pieces;
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

    openInsertNewDetailPiece() {
        this.errorMessage = "";
        this.nomPieceInsert = "";
        this.submitted = false;
        this.newPieceDetailDialog = true;
    }

    openUpdateDetailPiece(piece: any) {
        this.errorMessage = "";
        this.detailModif.idDetailPiece = piece._id;
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
        this.newPieceDetailDialog = true;
    }

    insertDetailPiece() {
        this.isLoading = true;
        this.validerUser.idUser = this.userCliquer._id;
        if (!this.detailInsert.idPiece || !this.detailInsert.idMarque ) {
            this.errorMessage = "Veuillez entrer les données corrects";
            this.isLoading = false;
        } else {
            this.managerService.insertDetailPiece(
                this.detailInsert.idPiece,
                this.detailInsert.idMarque,
            ).subscribe({
                next: (data) => {
                    this.hideNewPieceDetailDialog();     // Fermer le dialogue après le succès
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

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Etes vous sur de vouloir supprimer ces pièces ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                const ids = this.selectedProducts.map(product => product._id);
                console.log(ids);


                this.managerService.deleteDetailPiece(
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

    hideNewPieceDetailDialog() {
        this.newPieceDetailDialog = false;
        this.submitted = false;
        this.detailInsert = { idMarque: '', idPiece: '' };
    }

    hideUpdateDetailPieceDialog() {
        this.updatePieceDialog = false;
        this.submitted = false;
    }

    deleteDetailPiece(piece: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + piece.piece.nom + ' de '+ piece.marque.nom + '?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                this.managerService.deleteDetailPiece(
                    [piece._id]
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
        for (let i = 0; i < this.detailPieces.length; i++) {
            if (this.detailPieces[i]["_id"] === id) {
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
