import { Routes } from '@angular/router';
import { CRUDMarque } from '../../../pages/manager/details/marque/crudMarque';

export default [
    {
        path: 'crud',
        component: CRUDMarque
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
