import { Routes } from '@angular/router';
import { CRUDSousService } from '../../pages/manager/details/service/sous/crudSousService';

export default [
    {
        path: 'crudSousService',
        component: CRUDSousService
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
