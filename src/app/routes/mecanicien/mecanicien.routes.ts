import { Routes } from '@angular/router';

export default [
    {
        path: 'rdv',
        loadChildren: () => import('./rdv/rdv.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
