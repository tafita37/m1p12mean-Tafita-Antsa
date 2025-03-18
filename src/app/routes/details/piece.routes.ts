import { Routes } from '@angular/router';
import { CRUDPiece } from '../../pages/manager/details/piece/crudPiece';
import { CRUDDetailsPiece } from '../../pages/manager/details/piece/details/crudDetailPiece';

export default [
    {
        path: 'crud',
        component: CRUDPiece
    },
    {
        path: 'crudDetail',
        component: CRUDDetailsPiece
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
