import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl : "./featureswidget.html",
})
export class FeaturesWidget implements OnChanges {
    @Input() sousServices!: any[];

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Données mises à jour:', this.sousServices);
        // if (changes['sousServices']?.currentValue) {
        //     console.log('Données mises à jour:', this.sousServices);
        // }
    }
}
