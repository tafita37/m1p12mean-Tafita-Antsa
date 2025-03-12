import { Routes } from '@angular/router';
import { Crud } from './../../pages/crud/crud';

export default [
    {
        path: 'mecanicien',
        loadChildren: () => import('./../mecanicien/mecanicien.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
