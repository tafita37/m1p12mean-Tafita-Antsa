import { Component } from '@angular/core';
import { OtherStat } from './other/stat/otherStat';
import { RecentSalesWidget } from './other/recentsales/recentsaleswidget';
import { RevenueStreamWidget } from './other/revenuestream/revenuestreamwidget';
import { StatistiqueService } from '../../../service/manager/stat/statistique.service';

@Component({
    selector: 'app-dashboard',
    imports: [OtherStat, RecentSalesWidget, RevenueStreamWidget],
    templateUrl: './dashboard.html'
})
export class Dashboard {
    statFournisseur: {} = {};
    statMecanicien: {} = {};
    statClient: {} = {};
    topClients: any[] = [];
    statPiece = [];
    statService = [];
    anneeStat = new Date().getFullYear();
    anneeClient = new Date().getFullYear();

    constructor(private statistiqueService: StatistiqueService) { }

    loadData(): void {
        this.statistiqueService.getAllStat(this.anneeStat, this.anneeClient).subscribe(data => {
            this.statMecanicien= data.meilleurMecanicien.length != 0 ? data.meilleurMecanicien[0] : {};
            this.statFournisseur = data.bestFournisseur;
            this.statClient = data.bestClient.length!=0 ? data.bestClient[0] : {};
            // this.topClients = data.topClients;
            this.statPiece = data.statPiece;
            this.statService = data.statService;
            
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    onAnneeChange(nouvelleValeur: number) {
        this.anneeStat = nouvelleValeur;
        
        this.statistiqueService.getStatPieceService(this.anneeStat).subscribe(data => {
            // console.log(data);
            
            this.statPiece = data.statPiece;
            this.statService = data.statService;
            
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    onAnneeClientChange(nouvelleValeur: number) {
        this.anneeClient = nouvelleValeur;
        this.statistiqueService.getStatTopClient(this.anneeClient).subscribe(data => {
            this.topClients = data.topClients;
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    ngOnInit(): void {
        this.loadData();
    }
}
