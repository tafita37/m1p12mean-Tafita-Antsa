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
export class Landing {}
