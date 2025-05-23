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
    selector: 'app-crud-piece',
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
    templateUrl: './crudPiece.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CRUDPiece implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    newPieceDialog: boolean = false;
    updatePieceDialog: boolean = false;
    pieceInsert: {
        nom: string, type: number, prixReparation: number | null, prixRemplacement: number
    } = { nom: '', type: 11, prixReparation: null, prixRemplacement: 0 };
    pieceCliquer: {
        nom: string, type: number, prixReparation: number | null, prixRemplacement: number, idPiece: string
    } = { nom: '', type: 11, prixReparation: null, prixRemplacement: 0, idPiece: '' };
    pieces: [] = [];
    typePieces: [
        { id: number, value: string }, { id: number, value: string }
    ] = [{ id: 11, value: 'Réparable' }, { id: 1, value: 'Non réparable' }];

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

    selectedProducts: { _id: string, name: string }[] = [];

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    nbPiece: number = 0;

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


        this.pieces = [];
        this.managerService.getListPiece(page).subscribe(data => {
            this.pieces = data.pieces;
            this.nbPiece = data.nbPiece;
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

    openInsertNewPiece() {
        this.pieceInsert = { nom: '', type: 11, prixReparation: null, prixRemplacement: 0 };
        this.submitted = false;
        this.newPieceDialog = true;
    }

    openUpdatePiece(piece: any) {
        this.pieceCliquer.idPiece = piece._id;
        this.pieceCliquer.nom = piece.nom;
        this.pieceCliquer.type = piece.type;
        this.pieceCliquer.prixReparation = piece.prixReparation;
        this.pieceCliquer.prixRemplacement = piece.prixRemplacement;
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
        this.newPieceDialog = true;
    }

    insertPiece() {
        this.isLoading = true;
        this.validerUser.idUser = this.userCliquer._id;
        if (
            !this.pieceInsert.nom ||
            !this.pieceInsert.prixRemplacement ||
            this.pieceInsert.prixRemplacement == 0 ||
            !this.pieceInsert.type ||
            (this.pieceInsert.type != 1 && this.pieceInsert.type != 11) ||
            (this.pieceInsert.type == 11 && (!this.pieceInsert.prixReparation || this.pieceInsert.prixReparation == 0))
        ) {
            this.errorMessage = "Certaines données sont incorrectess ou manquantes";
            this.isLoading = false;
        } else {
            this.managerService.insertPiece(
                this.pieceInsert.nom,
                this.pieceInsert.type,
                this.pieceInsert.prixReparation,
                this.pieceInsert.prixRemplacement
            ).subscribe({
                next: (data) => {
                    this.hideNewPieceDialog();     // Fermer le dialogue après le succès
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

    updatePiece() {
        this.isLoading = true;
        if (
            !this.pieceCliquer.idPiece ||
            !this.pieceCliquer.nom ||
            !this.pieceCliquer.prixRemplacement ||
            this.pieceCliquer.prixRemplacement == 0 ||
            !this.pieceCliquer.type ||
            (this.pieceCliquer.type != 1 && this.pieceCliquer.type != 11) ||
            (
                this.pieceCliquer.type == 11 &&
                (!this.pieceCliquer.prixReparation || this.pieceCliquer.prixReparation == 0)
            )
        ) {
            this.errorMessage = "Veuillez indiquer l'outil que vous souhaitez modifier";
            this.isLoading = false;
        } else {
            this.managerService.updatePiece(
                this.pieceCliquer.idPiece,
                this.pieceCliquer.nom,
                this.pieceCliquer.type,
                this.pieceCliquer.prixReparation,
                this.pieceCliquer.prixRemplacement
            ).subscribe({
                next: (data) => {
                    this.hideUpdatePieceDialog();     // Fermer le dialogue après le succès
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
            message: 'Etes vous sur de vouloir supprimer ces outils ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                const ids = this.selectedProducts.map(product => product._id);
                console.log(ids);


                this.managerService.deletePiece(
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

    hideNewPieceDialog() {
        this.newPieceDialog = false;
        this.submitted = false;
    }

    hideUpdatePieceDialog() {
        this.updatePieceDialog = false;
        this.submitted = false;
    }

    deletePiece(piece: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + piece.nom + '?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                this.managerService.deletePiece(
                    [piece._id]
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
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i]["_id"] === id) {
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
