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
import { ManagerService, UserInterface } from '../../../../../service/manager/manager.service';
import { StockService } from '../../../../../service/manager/stock/stock.service';
import { Router } from '@angular/router';

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
    selector: 'app-crud-mecanicien',
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
    templateUrl: './stockPiece.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class StockPiece implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    newStockPieceDialog: boolean = false;
    updatePieceDialog: boolean = false;
    nomPieceInsert: string = '';
    pieceCliquer: { nom: string, idPiece: string } = { nom: '', idPiece: '' };
    listStock: [] = [];
    allPiece: [] = [];
    allMarque: [] = [];
    allUser: [] = [];
    allFournisseur: [] = [];
    mouvementInsert: {
        idPiece: string,
        idMarque: string,
        idUser: string,
        idFournisseur: string | null,
        prix: number,
        nb: number,
        isEntree: boolean,
        dateMouvement : Date
    } = {
            idPiece: '',
            idMarque: '',
            idUser: '',
            idFournisseur: '',
            prix: 0,
            nb: 0,
            isEntree: false,
            dateMouvement: new Date()
        };

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

    nbStock: number = 0;

    loading: boolean = false;
    _selectedDate: Date = new Date();

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private stockService: StockService,
        private router: Router
    ) { }

    redirectListeMouvement(stock : any) {
        this.router.navigate(['/manager/piece/listeMouvement/' + stock.detailPiece._id]);
    }
    exportCSV() {
        this.dt.exportCSV();
    }

    get selectedDate(): Date {
        return this._selectedDate;
    }

    set selectedDate(value: Date) {
        this._selectedDate = value;
        this.loadData();
    }

    loadData(event: any | null = null): void {
        var page = 1;
        if (event) {
            page = event.first / event.rows;
        }
        this.listStock = [];
        this.stockService.getListStock(page, this.selectedDate).subscribe(data => {
            this.listStock = data.stock;
            this.nbStock = data.nbStock;
            this.allPiece = data.pieces;
            this.allMarque = data.marques;
            this.allUser = data.users;
            this.allFournisseur = data.fournisseurs;
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

    openInsertNewStockPiece() {
        this.nomPieceInsert = "";
        this.submitted = false;
        this.newStockPieceDialog = true;
    }

    openUpdatePiece(piece: any) {
        this.pieceCliquer.idPiece = piece._id;
        this.pieceCliquer.nom = piece.nom;
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
        this.newStockPieceDialog = true;
    }

    insertStockPiece() {
        if (
            !this.mouvementInsert.idMarque ||
            !this.mouvementInsert.idPiece ||
            !this.mouvementInsert.idUser ||
            !this.mouvementInsert.prix ||
            !this.mouvementInsert.nb
        ) {
            this.errorMessage = "Veuillez compléter tout les champs";
        } else {
            if(this.mouvementInsert.isEntree){
                if (!this.mouvementInsert.idFournisseur) {
                    this.errorMessage = "Veuillez compléter tout les champs";
                    return;
                }
            } else {
                this.mouvementInsert.idFournisseur = null;
            }
            this.stockService.newMouvementStock(
                this.mouvementInsert.idPiece,
                this.mouvementInsert.idMarque,
                this.mouvementInsert.idUser,
                this.mouvementInsert.idFournisseur,
                this.mouvementInsert.prix,
                this.mouvementInsert.nb,
                this.mouvementInsert.isEntree,
                this.mouvementInsert.dateMouvement
            ).subscribe({
                next: (data) => {
                    this.hideNewStockPieceDialog();     // Fermer le dialogue après le succès
                    this.loadData();       // Recharger les données après le succès
                },
                error: (error) => {
                    console.error('Erreur lors de la connexion:', error);
                }
            });
        }
    }

    updatePiece() {
        if (!this.pieceCliquer.idPiece || !this.pieceCliquer.nom) {
            this.errorMessage = "Veuillez indiquer la pièce que vous souhaitez modifier";
        } else {
            // this.stockService.updatePiece(
            //     this.pieceCliquer.idPiece,
            //     this.pieceCliquer.nom
            // ).subscribe({
            //     next: (data) => {
            //         this.hideUpdatePieceDialog();     // Fermer le dialogue après le succès
            //         this.loadData();       // Recharger les données après le succès
            //     },
            //     error: (error) => {
            //         console.error('Erreur lors de la connexion:', error);
            //     }
            // });
        }
    }


    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Etes vous sur de vouloir supprimer ces pièces ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedProducts.map(product => product._id);
                console.log(ids);


                // this.stockService.deletePiece(
                //     ids
                // ).subscribe({
                //     next: (data) => {
                //         console.log(data.message);
                //         // this.hideDialog();     // Fermer le dialogue après le succès
                //         this.loadData();       // Recharger les données après le succès
                //     },
                //     error: (error) => {
                //         alert(error.error.message);
                //         console.error('Erreur lors de la connexion:', error);
                //     }
                // });
            }
        });
    }

    hideNewStockPieceDialog() {
        this.newStockPieceDialog = false;
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
                // this.stockService.deletePiece(
                //     [piece._id]
                // ).subscribe({
                //     next: (data) => {
                //         console.log(data.message);
                //         this.loadData();       // Recharger les données après le succès
                //     },
                //     error: (error) => {
                //         alert(error.error.message);
                //         console.error('Erreur lors de la connexion:', error);
                //     }
                // });
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
        for (let i = 0; i < this.listStock.length; i++) {
            if (this.listStock[i]["_id"] === id) {
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
