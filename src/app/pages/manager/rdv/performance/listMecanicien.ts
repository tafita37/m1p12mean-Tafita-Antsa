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
import { CommonModule } from '@angular/common';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { PerformanceService } from '../../../../service/manager/performance/performance.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-performance-mecanicien',
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
        ConfirmDialogModule,
        CalendarModule,
        InputNumberModule
    ],
    templateUrl: "./listMecanicien.html",
    styleUrl: "./listMecanicien.css",
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class ListMecanicien implements OnInit {
    customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];
    listMecanicien: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    balanceFrozen: boolean = false;

    loading: boolean = true;
    nbPlanning: number = 0;

    nbEtoilePlanning: any = {};

    @ViewChild('filter') filter!: ElementRef;

    etatTacheInsert: any = {};

    // Liste des mois avec id et label
    listeMois = [
        { id: null, label: 'Tout' },
        { id: 1, label: 'Janvier' },
        { id: 2, label: 'Février' },
        { id: 3, label: 'Mars' },
        { id: 4, label: 'Avril' },
        { id: 5, label: 'Mai' },
        { id: 6, label: 'Juin' },
        { id: 7, label: 'Juillet' },
        { id: 8, label: 'Août' },
        { id: 9, label: 'Septembre' },
        { id: 10, label: 'Octobre' },
        { id: 11, label: 'Novembre' },
        { id: 12, label: 'Décembre' },
    ];

    _moisRecherche: number|null = null;
    _anneeRecherche: number | null = null;

    titreAffichage: string = "Performance des mécaniciens";

    get moisRecherche(): number|null {
        return this._moisRecherche;
    }

    set moisRecherche(value: number|null) {
        this._moisRecherche = value;
        if (this.anneeRecherche != null&&this.moisRecherche != null) {
            this.loadData();
            this.titreAffichage = "Performances des mécaniciens en " + this.listeMois[this.moisRecherche].label + " " + this.anneeRecherche;
        }
    }

    get anneeRecherche(): number|null {
        return this._anneeRecherche;
    }

    set anneeRecherche(value: number | null) {
        this._anneeRecherche = value;
        this.loadData();
        if (this.moisRecherche != null) {
            this.titreAffichage = "Performances des mécaniciens en " + this.listeMois[this.moisRecherche].label + " " + this.anneeRecherche;
        } else {
            this.titreAffichage = "Performances des mécaniciens en "+ this.anneeRecherche;
        }
    }

    idDemande: string | null = "";

    constructor(
        private customerService: CustomerService,
        private performanceService: PerformanceService,
        public router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private route: ActivatedRoute,
    ) { }

    loadData(event: any | null = null): void {
        var page = 1;
        if (event) {
            page = (event.first / event.rows) + 1;
        }
        this.listMecanicien = [];
        this.performanceService.getAllPerformance(this.moisRecherche, this.anneeRecherche).subscribe(data => {
            this.listMecanicien = data.statsParMecanicien;
            this.loading = false;
        }, error => {
            this.loading = false;
            console.error('Erreur lors de la connexion:', error);
        });
    }

    ngOnInit() {
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
