import { Component } from '@angular/core';
// import { StatistiqueService } from '../../../service/manager/stat/statistique.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../../service/rdv/rdv.service';

@Component({
    selector: 'app-stat-performance',
    imports: [InputNumberModule, ChartModule, FormsModule],
    templateUrl: './suiviPerformance.html'
})
export class SuiviPerformance {
    statPiece: any;

    chartDataIntervention: any;
    chartDataEtoile: any;

    chartOptionsIntervention: any;
    chartOptionsEtoile: any;

    dataATemps : any[]=[];
    dataAvance : any[]=[];
    dataRetard : any[]=[];

    dataBonneNote : any[]=[];
    dataMauvaiseNote : any[]=[];

    subscription!: Subscription;

    anneeIntervention: number = new Date().getFullYear();
    anneeEtoile: number = new Date().getFullYear();

    constructor(public layoutService: LayoutService, private rdvService : RdvService) {}

    loadData() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');
        this.rdvService.getStatMecanicienPerformance(this.anneeIntervention, this.anneeEtoile).subscribe(data => {
            if(this.dataATemps.length==0&&this.dataAvance.length==0&&this.dataRetard.length==0) {
                for(let i=0; i<data.statPerformance.length; i++) {
                    this.dataATemps.push(data.statPerformance[i].aTemps);
                    this.dataAvance.push(data.statPerformance[i].enAvance);
                    this.dataRetard.push(data.statPerformance[i].aTemps);
                }
            }
            if(this.dataBonneNote.length==0&&this.dataMauvaiseNote.length==0) {
                for(let i=0; i<data.statEtoile.length; i++) {
                    this.dataBonneNote.push(data.statEtoile[i].nombreBonneNote);
                    this.dataMauvaiseNote.push(data.statEtoile[i].nombreMauvaisesNotes);
                }
            }
            this.initChart(textColor, borderColor, textMutedColor);
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    rechercheEtoile() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');
        this.dataBonneNote.splice(0, this.dataBonneNote.length);
        this.dataMauvaiseNote.splice(0, this.dataMauvaiseNote.length);
        this.rdvService.getStatMecanicienEtoile(this.anneeEtoile).subscribe(data => {
            if(this.dataBonneNote.length==0&&this.dataMauvaiseNote.length==0) {
                for(let i=0; i<data.statEtoile.length; i++) {
                    this.dataBonneNote.push(data.statEtoile[i].nombreBonneNote);
                    this.dataMauvaiseNote.push(data.statEtoile[i].nombreMauvaisesNotes);
                }
            }
            this.initEtoileChart(textColor, textMutedColor, borderColor);
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    rechercherIntervention() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');
        this.dataATemps.splice(0, this.dataATemps.length);
        this.dataAvance.splice(0, this.dataAvance.length);
        this.dataRetard.splice(0, this.dataRetard.length);
        this.rdvService.getStatMecanicienIntervention(this.anneeIntervention).subscribe(data => {
            if(this.dataATemps.length==0&&this.dataAvance.length==0&&this.dataRetard.length==0) {
                for(let i=0; i<data.statPerformance.length; i++) {
                    this.dataATemps.push(data.statPerformance[i].aTemps);
                    this.dataAvance.push(data.statPerformance[i].enAvance);
                    this.dataRetard.push(data.statPerformance[i].aTemps);
                }
            }
            this.initInterventionsChart(textColor, textMutedColor, borderColor);
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    ngOnInit() {
        this.loadData();
    }

    initInterventionsChart(textColor : string, textMutedColor:string, borderColor:string) {
        this.chartDataIntervention = {
            labels: [
                'Janvier',
                'Fevrier',
                'Mars',
                'Avril',
                'Mai',
                'Juin',
                'Juillet',
                'Aout',
                'Septembre',
                'Octobre',
                'Novembre',
                'Décembre'
            ],
            datasets: [
                {
                    type: 'bar',
                    label: 'Terminées à temps',
                    backgroundColor: "#4f8cff",
                    data: this.dataATemps,
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: 'Terminées en avance',
                    backgroundColor: "#69c779",
                    data: this.dataAvance,
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: 'Terminées en retard',
                    backgroundColor: "#f57c7c",
                    data: this.dataRetard,
                    barThickness: 32
                }
            ]
        };

        this.chartOptionsIntervention = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }

    initEtoileChart(textColor:string, textMutedColor:string, borderColor:string) {
        this.chartDataEtoile = {
            labels: [
                'Janvier',
                'Fevrier',
                'Mars',
                'Avril',
                'Mai',
                'Juin',
                'Juillet',
                'Aout',
                'Septembre',
                'Octobre',
                'Novembre',
                'Décembre'
            ],
            datasets: [
                {
                    type: 'bar',
                    label: 'Fréquence de bonnes notes',
                    backgroundColor: '#69c779',
                    data: this.dataBonneNote
                },
                {
                    type: 'bar',
                    label: 'Fréquence des mauvaises notes',
                    backgroundColor: '#f57c7c',
                    data: this.dataMauvaiseNote
                }
            ]            
        };
        
        

        this.chartOptionsEtoile = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    // stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    // stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }

    initChart(textColor:string, borderColor:string, textMutedColor:string) {
        this.initInterventionsChart(textColor, textMutedColor, borderColor);
        this.initEtoileChart(textColor, textMutedColor, borderColor);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

