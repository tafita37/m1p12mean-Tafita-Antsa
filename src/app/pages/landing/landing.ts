import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbar/topbarwidget.component';
import { HeroWidget } from './components/herowidget/herowidget';
import { FeaturesWidget } from './components/featureswidget/featureswidget';
import { PricingWidget } from './components/pricingwidget/pricingwidget';
import { AppFooter } from '../../layout/component/footer/app.footer';
import { LandingService } from '../../service/landing/landing.service';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        RouterModule,
        TopbarWidget,
        HeroWidget,
        FeaturesWidget,
        PricingWidget,
        RippleModule,
        StyleClassModule,
        ButtonModule,
        DividerModule,
        AppFooter
    ],
    templateUrl : "./landing.html",
})
export class Landing {
    sousServices : any[] = [];

    constructor(private landingService: LandingService) { }

    loadData(): void {
        this.landingService.getAllDatas().subscribe(data => {
            this.sousServices=data.sousServices;
        }, error => {
            console.error('Erreur lors de la connexion:', error);
        });
    }

    ngOnInit(): void {
        this.loadData();
    }
}
