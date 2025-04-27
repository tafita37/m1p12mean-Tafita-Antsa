import { Routes } from '@angular/router';
import { SuiviPerformance } from '../../pages/mecanicien/stat/suiviPerformance';

export default [
    {
        path: 'stat',
        component : SuiviPerformance
    },
    {
        path: 'rdv',
        loadChildren: () => import('./rdv/rdv.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
