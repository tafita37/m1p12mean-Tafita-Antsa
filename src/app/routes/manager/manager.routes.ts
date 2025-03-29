import { Routes } from '@angular/router';

export default [
    {
        path: 'user',
        loadChildren: () => import('../user/user.routes')
    },
    {
        path: 'piece',
        loadChildren: () => import('../details/piece.routes')
    },
    {
        path: 'marque',
        loadChildren: () => import('../details/marque.routes')
    },
    {
        path: 'service',
        loadChildren: () => import('../details/service.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
