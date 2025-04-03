import { Routes } from '@angular/router';

export default [
    {
        path: 'voiture',
        loadChildren: () => import('./voiture/voiture.routes')
    },
    {
        path: 'rdv',
        loadChildren: () => import('./rdv/rdv.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
