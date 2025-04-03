import { ChangeDetectorRef, Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { Product, ProductService } from '../../../../service/product.service';
import { ManagerService, UserInterface } from '../../../../../service/manager/manager.service';
import { Popover, PopoverModule } from 'primeng/popover';
import { MultiSelectModule } from 'primeng/multiselect';
import { Country } from '../../../../service/customer.service';

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
    selector: 'app-crud-sous-service',
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
        PopoverModule,
        MultiSelectModule
    ],
    templateUrl: './crudSousService.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CRUDSousService implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    newSousServiceDialog: boolean = false;
    updatePieceDialog: boolean = false;
    nomPieceInsert: string = '';
    sousServices: [] = [];
    listPieceCliquer: [] = [];
    sousCliquer: any = {};
    allPieces : any[] = [];
    allPieceUpdate : any[] = [];
    products: Product[] = [];
    piecesSelected: any[] = [];
    piecesSelectedUpdate: any[] = [];
    typeSelected: any[] = [];
    typeSelectedUpdate: any[] = [];
    multiselectCountries: Country[] = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];
    typePieces: [
        { id: number, value: string }, { id: number, value: string }
    ] = [{ id: 11, value: 'Réparable' }, { id: 1, value: 'Non réparable' }];
    sousServiceInsert : {nom:string, prix:number, pieces: any[]} = {nom:"", prix:0, pieces:[]};
    sousServiceUpdate : {id : string, nom:string, prix:number, pieces: any[]} = {id : "", nom:"", prix:0, pieces:[]};

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

    selectedProduct!: Product;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    nbSousServices: number = 0;

    loading: boolean = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private managerService: ManagerService,
        private cdRef: ChangeDetectorRef
    ) { }

    exportCSV() {
        this.dt.exportCSV();
    }

    loadData(event: any | null = null): void {
        var page = 1;
        if (event) {
            page = (event.first / event.rows)+1;
        }
        this.sousServices = [];
        this.managerService.getListSousService(page).subscribe(data => {
            this.sousServices = data.listSousServices;
            console.log(data.listSousServices);

            this.nbSousServices = data.nbSousServices;
            this.allPieces = data.pieces;
            for (let i = 0; i < this.allPieces.length; i++) {
                this.allPieces[i].isSelected = false;
            }
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    toggleDataTable(op: Popover, sous: any, event: any) {
        this.sousCliquer={};
        this.sousCliquer = sous;
        this.listPieceCliquer = sous.pieces;
        op.toggle(event);
        console.log(this.listPieceCliquer);
    }

    onProductSelect(op: Popover, event: any) {
        op.hide();
        this.messageService.add(
            { severity: 'info', summary: 'Product Selected', detail: event?.data.name, life: 3000 }
        );
    }

    ngOnInit(): void {
        this.loadData();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openInsertSousService() {
        this.nomPieceInsert = "";
        this.submitted = false;
        this.newSousServiceDialog = true;
    }

    openUpdateSous(sous: any) {
        this.sousServiceUpdate = { id: sous._id, nom: sous.nom, prix: sous.prix, pieces: [] };
        // allPieceUpdate filtre allPiece where allPiece._id n'est pas dans sous.pieces._id
        this.allPieceUpdate = this.allPieces.filter((piece) => {
            return !sous.pieces.some((sousPiece: any) => sousPiece.piece._id === piece._id);
        });
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
        this.newSousServiceDialog = true;
    }

    onMultiselectChange(event: any) {
        // 1. Cloner le tableau pour forcer la détection de changement
        this.allPieces = [...this.allPieces];

        // 2. Mettre à jour isSelected en comparant les _id
        const selectedIds = new Set(this.piecesSelected);

        this.allPieces.forEach(piece => {
            piece.isSelected = selectedIds.has(piece._id);
        });
    }


    onMultiselectChangeUpdate(event:any) {
        // 1. Cloner le tableau pour forcer la détection de changement
        this.allPieceUpdate = [...this.allPieceUpdate];

        // 2. Mettre à jour isSelected en comparant les _id
        const selectedIds = new Set(this.piecesSelectedUpdate);

        this.allPieceUpdate.forEach(piece => {
            piece.isSelected = selectedIds.has(piece._id);
        });
    }

    onTypeChange(event: any, piece: any) {
        if (event?.originalEvent?.stopPropagation) {
            event.originalEvent.stopPropagation();
        }
        this.typeSelected[piece._id] = event.value;
    }

    onTypeChangeUpdate(event: any, piece: any) {
        if (event?.originalEvent?.stopPropagation) {
            event.originalEvent.stopPropagation();
        }
        this.typeSelectedUpdate[piece._id] = event.value;
    }


    insertPiece() {
        if (
            !this.sousServiceInsert ||
            !this.sousServiceInsert.nom ||
            !this.sousServiceInsert.prix ||
            this.sousServiceInsert.prix == 0 ||
            this.typeSelected.length == this.piecesSelected.length
        ) {
            this.errorMessage = "Les données entrées sont incorrectes";
        } else {
            this.sousServiceInsert.pieces=[];
            for (let i = 0; i < this.piecesSelected.length; i++) {
                this.sousServiceInsert.pieces.push({
                    piece: this.piecesSelected[i],
                    etat: this.typeSelected[this.piecesSelected[i]]
                })
            }
            this.managerService.insertSousService(
                this.sousServiceInsert.nom,
                this.sousServiceInsert.prix,
                this.sousServiceInsert.pieces
            ).subscribe({
                next: (data) => {
                    this.hideNewSousServiceDialog();     // Fermer le dialogue après le succès
                    this.loadData();       // Recharger les données après le succès
                },
                error: (error) => {
                    console.error('Erreur lors de la connexion:', error);
                }
            });
        }
    }

    updatePiece() {
        if (
            !this.sousServiceUpdate ||
            !this.sousServiceUpdate.id ||
            !this.sousServiceUpdate.nom ||
            !this.sousServiceUpdate.prix ||
            this.sousServiceUpdate.prix == 0 ||
            this.typeSelectedUpdate.length == this.piecesSelectedUpdate.length
        ) {
            this.errorMessage = "Les données entrées sont incorrectes";
        } else {

            this.sousServiceInsert.pieces = [];
            for (let i = 0; i < this.piecesSelectedUpdate.length; i++) {
                this.sousServiceUpdate.pieces.push({
                    piece: this.piecesSelectedUpdate[i],
                    etat: this.typeSelectedUpdate[this.piecesSelectedUpdate[i]]
                })
            }
            this.managerService.updateSousService(
                this.sousServiceUpdate.id,
                this.sousServiceUpdate.nom,
                this.sousServiceUpdate.prix,
                this.sousServiceUpdate.pieces
            ).subscribe({
                next: (data) => {
                    this.hideUpdateSousDialog();     // Fermer le dialogue après le succès
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
            message: 'Etes vous sur de vouloir supprimer ces pièces ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedProducts.map(product => product._id);
                console.log(ids);


                this.managerService.deleteSousServices(
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

    hideNewSousServiceDialog() {
        this.newSousServiceDialog = false;
        this.submitted = false;
        this.sousServiceInsert = { nom: "", prix: 0, pieces: [] };
    }

    hideUpdateSousDialog() {
        this.updatePieceDialog = false;
        this.submitted = false;
    }

    deleteSousService(sous: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + sous.nom + '?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.managerService.deleteSousServices(
                    [sous._id]
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        this.loadData();       // Recharger les données après le succès
                    },
                    error: (error) => {
                        alert(error.error.message);
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

    deletePieceFromSous(piece: any) {
        console.log(piece);

        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer "' + piece.piece.nom + '" de "' + this.sousCliquer.nom + '"?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.managerService.deletePieceFromSous(
                    this.sousCliquer._id,
                    piece.piece._id
                ).subscribe({
                    next: (data) => {
                        console.log(data.message);
                        this.loadData();       // Recharger les données après le succès
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Deleted',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        alert(error.error.message);
                        console.error('Erreur lors de la connexion:', error);
                    }
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.sousServices.length; i++) {
            if (this.sousServices[i]["_id"] === id) {
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
