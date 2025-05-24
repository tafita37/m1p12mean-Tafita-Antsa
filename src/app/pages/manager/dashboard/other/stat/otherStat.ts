import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-other-stat',
    imports: [CommonModule, Rating, FormsModule],
    templateUrl: "./otherStat.html"
})
export class OtherStat implements OnChanges {
    @Input() fournisseurStat: any; // Ou un type plus spécifique
    @Input() clientStat: any; // Ou un type plus spécifique
    @Input() statMecanicien: any; // Ou un type plus spécifique

    ngOnChanges(changes: SimpleChanges) {
    }
}
