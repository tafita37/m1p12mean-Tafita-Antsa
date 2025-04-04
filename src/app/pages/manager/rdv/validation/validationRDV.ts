import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Customer, CustomerService, Representative } from '../../../service/customer.service';
import { Product, ProductService } from '../../../service/product.service';
import { RdvService } from '../../../../service/rdv/rdv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { Calendar } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { StockService } from '../../../../service/manager/stock/stock.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-validation-rdv',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        InputNumberModule,
        Calendar,
        MessageModule,
        DialogModule,
        DatePickerModule
    ],
    templateUrl: "./validationRDV.html",
    styleUrl: "./validationRDV.css",
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class ValidationRDV implements OnInit {
    customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    achatPieceDialog: boolean = false;

    venteDialog : boolean = false;

    errorMessage: string = "";

    statuses: any[] = [];
    listDemande: any[] = [];
    allFournisseur: any[] = [];
    listeAVendre: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    balanceFrozen: boolean = false;

    loading: boolean = true;
    idDemande: string | null = "";

    details : any[] = [];
    listPieceAcheter : any[] = [];
    nbListPieceAcheter : number=0;
    allMecanicien : any[] = [];
    datePropose: any[] = [];
    validationInsert: any = {};
    minTime: Date=new Date();
    maxTime: Date = new Date();
    nomAchat: string = "";
    formAchatPiece: {
        idPiece: string,
        idMarque: string,
        idUser: string,
        quantite: number,
        dateMouvement: Date,
        idFournisseur: string | null,
        prixAchat: number
    } = {
            idPiece: "",
            idMarque: "",
            idUser: "",
            quantite: 0,
            dateMouvement: new Date(),
            idFournisseur: "",
            prixAchat: 0
        }
    demande: any = {};

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private rdvService: RdvService,
        private stockService: StockService,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe
    ) { }

    getFullName(mecanicien: any): string {
        return mecanicien.user.nom + ' ' + mecanicien.user.prenom;
    }

    openNewAchatPieceDialog(piece: any) {
        this.formAchatPiece={
            idPiece: "",
            idMarque: "",
            idUser: "",
            quantite: 0,
            dateMouvement: new Date(),
            idFournisseur: "",
            prixAchat: 0
        }
        this.formAchatPiece.idPiece = piece.piece._id;
        this.formAchatPiece.idMarque = this.demande.voiture.marque;
        // this.formAchatPiece.idUser = this.demande.voiture.client.user;
        this.formAchatPiece.quantite = piece.quantite;
        this.nomAchat=piece.piece.nom;
        this.achatPieceDialog = true;
    }

    openVenteDialog() {
        this.venteDialog = true;
    }

    closeVenteDialog() {
        this.venteDialog = false;
    }

    hideNewAchatPieceDialog() {
        this.achatPieceDialog = false;
    }

    acheterPiece() {
        this.stockService.newMouvementStock(
            this.formAchatPiece.idPiece,
            this.formAchatPiece.idMarque,
            this.formAchatPiece.idUser,
            this.formAchatPiece.idFournisseur,
            this.formAchatPiece.prixAchat,
            this.formAchatPiece.quantite,
            true,
            this.formAchatPiece.dateMouvement
        ).subscribe(data => {
            this.hideNewAchatPieceDialog();
            this.loadData();
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    validerRDV() {
        let planning = [];
        for (let i = 0; i < this.details.length; i++) {
            const dateDebut = new Date(this.validationInsert[this.details[i].sousService._id].date);
            const heureDebut = new Date(this.validationInsert[this.details[i].sousService._id].heureDebut);
            const dateHeureDebut = new Date(
                Date.UTC(
                    dateDebut.getFullYear(),
                    dateDebut.getMonth(),
                    dateDebut.getDate(),
                    heureDebut.getHours(),
                    heureDebut.getMinutes(),
                    heureDebut.getSeconds()
                )
            ).toISOString();
            console.log(dateHeureDebut);
            planning.push({
                sous: this.details[i].sousService._id,
                mecanicien: this.validationInsert[this.details[i].sousService._id].idMecanicien,
                qte: this.validationInsert[this.details[i].sousService._id].quantite,
                dateHeureDebut: dateHeureDebut
            });
        }
        for (let i = 0; i < this.listeAVendre.length; i++) {
            console.log(this.listeAVendre[i].quantite);
            this.listeAVendre[i].dateMouvement = new Date();
            this.stockService.newMouvementStock(
                this.listeAVendre[i].piece._id,
                this.demande.voiture.marque,
                this.demande.voiture.client.user,
                null,
                this.listeAVendre[i].prix,
                this.listeAVendre[i].quantite,
                false,
                this.listeAVendre[i].dateMouvement
            ).subscribe(data => {
                this.closeVenteDialog();
                this.loadData();
            }, error => {
                console.error('Erreur lors de la connexion:', error);
            });
        }
        this.rdvService.validerRDV(
            this.idDemande,
            planning,
            this.listeAVendre
        ).subscribe(data => {
            this.router.navigate(['/manager/rdv/nonValider']);
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }


    loadData(event: any | null = null): void {
        var page = 1;
        if (event) {
            page = (event.first / event.rows) + 1;
        }
        // this.marques = [];
        this.rdvService.getAllDataForValidation(this.idDemande).subscribe(data => {
            console.log(data.listeAVendre);
            this.listeAVendre=data.listeAVendre;
            this.allFournisseur = data.allFournisseur;
            this.demande = data.demande;
            this.details = data.demande.details.details;
            for (let i = 0; i < this.details.length; i++) {
                this.validationInsert[this.details[i].sousService._id] = {
                    idSousService : this.details[i].sousService._id,
                    idMecanicien: null,
                    date: null,
                    heureDebut: null,
                    quantite : data.demande.details.details[i].qte
                };
            }

            this.allMecanicien = data.allMecanicien.map((m: any) => ({
                ...m,
                fullName: `${m.user.nom} ${m.user.prenom}`,
                idUser : m.user._id
            }));
            this.datePropose = data.demande.date.map((d: string) => {
                // Formatter chaque date de string en 'yyyy-MM-dd'
                return this.datePipe.transform(new Date(d), 'yyyy-MM-dd');
            });
            this.listPieceAcheter = data.listPiece;
            this.nbListPieceAcheter = this.listPieceAcheter.length;
            this.loading = false;

        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    ngOnInit() {
        this.minTime.setHours(8, 0);
        this.maxTime.setHours(17, 0);
        this.idDemande = this.route.snapshot.paramMap.get('idDemande');
        this.loadData();
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                } else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup = previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    } else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }

    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach((product) => (product && product.name ? (this.expandedRows[product.name] = true) : ''));
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }

    calculateCustomerTotal(name: string) {
        let total = 0;

        if (this.customers2) {
            for (let customer of this.customers2) {
                if (customer.representative?.name === name) {
                    total++;
                }
            }
        }

        return total;
    }
}
