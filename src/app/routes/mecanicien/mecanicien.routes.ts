import { Routes } from '@angular/router';
import { CrudMecanicien } from '../../pages/crud/mecanicien/crudMecanicien';

export default [
    {
        path: 'crud',
        component: CrudMecanicien
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
