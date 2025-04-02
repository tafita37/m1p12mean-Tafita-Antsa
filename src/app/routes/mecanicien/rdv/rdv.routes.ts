import { Routes } from '@angular/router';
import { ListeTache } from '../../../pages/mecanicien/rdv/listeTache';

export default [
    {
        path: 'listeTache',
        component: ListeTache
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
