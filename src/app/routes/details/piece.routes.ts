import { Routes } from '@angular/router';
import { UserNotValider } from '../../pages/manager/details/crudPiece';

export default [
    {
        path: 'crud',
        component: UserNotValider
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
