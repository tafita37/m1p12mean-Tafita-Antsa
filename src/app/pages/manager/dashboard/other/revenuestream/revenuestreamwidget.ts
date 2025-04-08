import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../../../layout/service/layout.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-revenue-ca',
    imports: [ChartModule, InputNumberModule,FormsModule],
    templateUrl: "./revenuestreamwidget.html"
})
export class RevenueStreamWidget implements OnChanges {
    @Input() statPiece: any;

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.statPiece);
        if (changes['statPiece'] && this.statPiece) {
            this.initChart();
        }
    }

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    _anneeCA: number = 0;

    @Output() anneeChange = new EventEmitter<number>();

    get anneeCA(): number {
        return this._anneeCA;
    }

    set anneeCA(value: number) {
        this._anneeCA = value;
        this.anneeChange.emit(value);
    }

    constructor(public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.anneeCA = new Date().getFullYear();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.chartData = {
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
                    label: 'Pièces',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                    data: this.statPiece.map((stat: any) => stat.total),
                    // data: [5000, 10000, 15000, 4000, 5000, 10000, 15000, 4000, 5000, 10000, 15000, 4000],
                    barThickness: 10
                },
                {
                    type: 'bar',
                    label: 'Services',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-700'),
                    data: [2100, 8400, 2400, 7500, 5000, 10000, 15000, 4000, 5000, 10000, 15000, 4000],
                    barThickness: 10
                }
            ]
        };

        this.chartOptions = {
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

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
