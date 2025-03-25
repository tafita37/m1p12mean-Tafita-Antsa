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
    statPiece = [];
    anneeStat = new Date().getFullYear();

    constructor(private statistiqueService: StatistiqueService) { }

    loadData(): void {
        this.statistiqueService.getAllStat(this.anneeStat).subscribe(data => {
            this.statFournisseur = data.bestFournisseur;
            this.statPiece = data.statPiece;
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    onAnneeChange(nouvelleValeur: number) {
        this.anneeStat = nouvelleValeur;
        this.loadData();
    }

    ngOnInit(): void {
        this.loadData();
    }
}
