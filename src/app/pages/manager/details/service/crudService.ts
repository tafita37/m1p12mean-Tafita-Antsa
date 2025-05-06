import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { Product, ProductService } from '../../../service/product.service';
import { ManagerService } from '../../../../service/manager/manager.service';
import { Popover, PopoverModule } from 'primeng/popover';
import { MultiSelectModule } from 'primeng/multiselect';
import { Country } from '../../../service/customer.service';
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
    selector: 'app-crud-service',
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
        MultiSelectModule,
        ProgressSpinnerModule
    ],
    templateUrl: './crudService.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CRUDService implements OnInit {
    errorMessage: string = '';
    sucessMessage: string = '';
    newServiceDialog: boolean = false;
    updatePieceDialog: boolean = false;
    nomPieceInsert: string = '';
    services: [] = [];
    listSousCliquer: [] = [];
    serviceCliquer: any = {};
    allSousServices : any[] = [];
    allSousServicesUpdate : any[] = [];
    products: Product[] = [];
    sousSelected: any[] = [];
    sousSelectedUpdate: any[] = [];
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
    serviceInsert: { nom: string } = { nom: ""};
    serviceUpdate: { id: string, nom: string } = { id: "", nom: "" };
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

    selectedProduct!: Product;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    nbServices: number = 0;

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
        this.loading = true;
        var page = 1;
        if (event) {
            page = (event.first / event.rows)+1;
        }
        this.services = [];
        this.managerService.getListService(page).subscribe(data => {
            this.services = data.listServices;
            this.nbServices = data.nbServices;
            this.allSousServices = data.allSousServices;
            this.loading = false;
        }, error => {
            console.error('Erreur lors de la connexion:', error);
            this.loading = false;
        });
    }

    toggleDataTable(op: Popover, service: any, event: any) {
        this.serviceCliquer={};
        this.serviceCliquer = service;
        console.log(service.sousServices);
        this.listSousCliquer = service.sousServices;
        op.toggle(event);
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

    openInsertService() {
        this.submitted = false;
        this.newServiceDialog = true;
        this.serviceInsert = { nom: "" };
        this.sousSelected = [];
    }

    openUpdateService(sous: any) {
        this.serviceUpdate = { id: sous._id, nom: sous.nom };
        this.allSousServicesUpdate = this.allSousServices.filter((piece) => {
            return !sous.sousServices.some((sousPiece: any) => sousPiece._id === piece._id);
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
        this.newServiceDialog = true;
    }

    onMultiselectChange(event: any) {
        // 1. Cloner le tableau pour forcer la détection de changement
        this.allSousServices = [...this.allSousServices];

        // 2. Mettre à jour isSelected en comparant les _id
        const selectedIds = new Set(this.sousSelected);

        this.allSousServices.forEach(piece => {
            piece.isSelected = selectedIds.has(piece._id);
        });
    }


    onMultiselectChangeUpdate(event:any) {
        // 1. Cloner le tableau pour forcer la détection de changement
        this.allSousServicesUpdate = [...this.allSousServicesUpdate];

        // 2. Mettre à jour isSelected en comparant les _id
        const selectedIds = new Set(this.piecesSelectedUpdate);

        this.allSousServicesUpdate.forEach(piece => {
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


    insertService() {
        this.isLoading = true;
        if (
            !this.serviceInsert ||
            !this.serviceInsert.nom ||
            !this.sousSelected ||
            this.sousSelected.length == 0
        ) {
            this.errorMessage = "Les données entrées sont incorrectes";
            this.isLoading = false;
        } else {
            this.managerService.insertService(
                this.serviceInsert.nom,
                this.sousSelected
            ).subscribe({
                next: (data) => {
                    this.hideNewServiceDialog();     // Fermer le dialogue après le succès
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
            !this.serviceUpdate ||
            !this.serviceUpdate.id ||
            !this.serviceUpdate.nom
        ) {
            this.errorMessage = "Les données entrées sont incorrectes";
            this.isLoading = false;
        } else {
            this.managerService.updateService(
                this.serviceUpdate.id,
                this.serviceUpdate.nom,
                this.sousSelectedUpdate
            ).subscribe({
                next: (data) => {
                    this.hideUpdateSousDialog();     // Fermer le dialogue après le succès
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
            message: 'Etes vous sur de vouloir supprimer ces services ?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                const ids = this.selectedProducts.map(product => product._id);
                console.log(ids);


                this.managerService.deleteServices(
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

    hideNewServiceDialog() {
        this.newServiceDialog = false;
        this.submitted = false;
        this.serviceInsert = { nom: "" };
        this.sousSelected = [];
    }

    hideUpdateSousDialog() {
        this.updatePieceDialog = false;
        this.submitted = false;
    }

    deleteService(service: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer ' + service.nom + '?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                this.managerService.deleteServices(
                    [service._id]
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

    deleteSousFromService(sous: any) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sur de vouloir supprimer "' + sous.nom + '" de "' + this.serviceCliquer.nom + '"?',
            header: 'Confirmer',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.isLoading = true;
                this.managerService.deleteSousFromService(
                    this.serviceCliquer._id,
                    sous._id
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

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.services.length; i++) {
            if (this.services[i]["_id"] === id) {
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
