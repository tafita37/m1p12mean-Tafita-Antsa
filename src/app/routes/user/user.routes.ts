import { Routes } from '@angular/router';
import { CrudUser } from '../../pages/crud/mecanicien/crudUser';

export default [
    {
        path: 'crud',
        component: CrudUser
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
