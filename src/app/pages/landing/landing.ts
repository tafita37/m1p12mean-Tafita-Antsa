import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbar/topbarwidget.component';
import { HeroWidget } from './components/herowidget/herowidget';
import { FeaturesWidget } from './components/featureswidget/featureswidget';
import { HighlightsWidget } from './components/highlightswidget/highlightswidget';
import { PricingWidget } from './components/pricingwidget/pricingwidget';
import { FooterWidget } from './components/footer/footerwidget';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, HeroWidget, FeaturesWidget, HighlightsWidget, PricingWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    templateUrl : "./landing.html",
})
export class Landing {}
