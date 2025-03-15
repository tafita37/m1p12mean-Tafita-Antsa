import { Routes } from '@angular/router';
import { Crud } from './../../pages/crud/crud';

export default [
    {
        path: 'user',
        loadChildren: () => import('../user/user.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
