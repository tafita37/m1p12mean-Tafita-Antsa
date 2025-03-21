import { Routes } from '@angular/router';
import { CRUDPiece } from '../../pages/manager/details/piece/crudPiece';
import { CRUDDetailsPiece } from '../../pages/manager/details/piece/details/crudDetailPiece';
import { CRUDFournisseur } from '../../pages/manager/details/piece/fournisseur/crudFournisseur';
import { StockPiece } from '../../pages/manager/details/piece/stock/stockPiece';

export default [
    {
        path: 'crud',
        component: CRUDPiece
    },
    {
        path: 'stock',
        component: StockPiece
    },
    {
        path: 'crudDetail',
        component: CRUDDetailsPiece
    },
    {
        path: 'crudFournisseur',
        component: CRUDFournisseur
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
