import { Routes } from '@angular/router';
import { RDV } from '../../../pages/client/rdv/rdv';

export default [
    {
        path: 'rdv',
        component: RDV
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
