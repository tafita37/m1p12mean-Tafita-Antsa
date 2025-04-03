import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../../app.configurator/app.configurator';
import { LayoutService } from '../../../service/layout.service';

@Component({
    selector: 'app-topbar-mecanicien',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    templateUrl : "./app.topbar.html",
})
export class AppTopbarMecanicien {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService) { }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
