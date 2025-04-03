import { Routes } from '@angular/router';
import { ListMecanicien } from '../../pages/manager/rdv/performance/listMecanicien';

export default [
    {
        path: 'mecanicien',
        loadChildren: () => import('./mecanicien/mecanicien.routes')
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.routes')
    },
    {
        path: 'piece',
        loadChildren: () => import('./details/piece.routes')
    },
    {
        path: 'marque',
        loadChildren: () => import('./details/marque.routes')
    },
    {
        path: 'service',
        loadChildren: () => import('./details/service.routes')
    },
    {
        path: 'rdv',
        loadChildren: () => import('../manager/rdv/rdv.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
