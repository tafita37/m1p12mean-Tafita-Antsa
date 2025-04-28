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
import { Customer, CustomerService, Representative } from '../../service/customer.service';
import { Product, ProductService } from '../../service/product.service';
import { RdvService } from '../../../service/rdv/rdv.service';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-liste-tache',
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
        InputNumberModule,
        DialogModule,
        ProgressSpinnerModule
    ],
    templateUrl: "./listeTache.html",
    styleUrl: "./listeTache.css",
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class ListeTache implements OnInit {
    customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];
    listPlanning: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    balanceFrozen: boolean = false;

    loading: boolean = false;
    isLoading: boolean = false;
    nbPlanning: number = 0;

    @ViewChild('filter') filter!: ElementRef;

    etatTacheInsert: any = {};

    constructor(
        private customerService: CustomerService,
        private RDVService: RdvService,
        public router: Router,
        private confirmationService: ConfirmationService,
        private messageService : MessageService
    ) { }

    updateEtatTache(tache: any) {
        this.isLoading=true;
        this.RDVService.updatePlanning(
            this.etatTacheInsert[tache._id].idPlanning,
            this.etatTacheInsert[tache._id].tempsPasse,
            this.etatTacheInsert[tache._id].resteAFaire
        ).subscribe(data => {
            this.isLoading=false;
            this.loadData();
        }, error => {
            console.error('Erreur lors de la connexion:', error);
            this.isLoading=false;
        });
    }

    loadData(event: any | null = null): void {
        var page = 1;
        if (event) {
            page = (event.first / event.rows) + 1;
        }
        this.listPlanning = [];
        this.loading=true;
        this.RDVService.getPlanningMecanicien(page).subscribe(data => {
            this.listPlanning = data.listPlanning;
            for (let i = 0; i < this.listPlanning.length; i++) {
                let dateHeureDebut = new Date(this.listPlanning[i].dateHeureDebut);
                let dateHeureFin = new Date(dateHeureDebut);
                dateHeureFin.setMinutes(dateHeureFin.getMinutes() + this.listPlanning[i].estimationTotal);
                this.listPlanning[i].dateHeureDebut = dateHeureDebut.toISOString().replace('Z', '');
                this.listPlanning[i].dateHeureFin = dateHeureFin.toISOString().replace('Z', '');
                this.listPlanning[i].avancement = (this.listPlanning[i].tempsPasse / (this.listPlanning[i].tempsPasse + this.listPlanning[i].resteAFaire))*100;
                if (this.listPlanning[i].avancement > 100) {
                    this.listPlanning[i].avancement = 100;
                }
                this.etatTacheInsert[this.listPlanning[i]._id] = {
                    idPlanning: this.listPlanning[i]._id,
                    tempsPasse: this.listPlanning[i].tempsPasse,
                    resteAFaire: this.listPlanning[i].resteAFaire
                };
            }
            console.log(this.etatTacheInsert);

            this.nbPlanning = data.nbPlanning;
            this.loading = false;
        }, error => {
            console.error('Erreur lors de la connexion:', error);
            this.loading=false;
        });
    }

    ngOnInit() {
        this.loadData();
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    refuserRDV(demande: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir refuser la demande de ' + demande.voiture.client.user.nom + " " + demande.voiture.client.user.prenom+' ?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.RDVService.refuserRDV(demande._id).subscribe({
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
