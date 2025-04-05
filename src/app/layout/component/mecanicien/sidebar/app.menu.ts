import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../../app.menuitem';

@Component({
    selector: 'app-menu-mecanicien',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    templateUrl : "./app.menu.html"
})
export class AppMenuMecanicien {
    @Input() model: MenuItem[] = [];
}
