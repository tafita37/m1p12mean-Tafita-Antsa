import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-other-stat',
    imports: [CommonModule],
    templateUrl: "./otherStat.html"
})
export class OtherStat implements OnChanges {
    @Input() fournisseurStat: any; // Ou un type plus spécifique

    ngOnChanges(changes: SimpleChanges) {
    }
}
