import { Routes } from '@angular/router';

export default [
    {
        path: 'voiture',
        loadChildren: () => import('../voiture/voiture.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
