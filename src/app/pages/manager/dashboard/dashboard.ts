import { Component } from '@angular/core';
import { StatsWidget } from './other/stat/statswidget';
import { RecentSalesWidget } from './other/recentsales/recentsaleswidget';
import { RevenueStreamWidget } from './other/revenuestream/revenuestreamwidget';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, RevenueStreamWidget],
    templateUrl: './dashboard.html'
})
export class Dashboard { }
