import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../../app.configurator/app.configurator';
import { LayoutService } from '../../../service/layout.service';

@Component({
    selector: 'app-topbar-client',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    templateUrl : "./app.topbar.html",
})
export class AppTopbarClient {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService,
        private router: Router
    ) { }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    isProfileMenuOpen = false;

    toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    }

    logout() {
        localStorage.removeItem('client_token');
        this.router.navigate(['/auth/loginClient']);
    }
}
