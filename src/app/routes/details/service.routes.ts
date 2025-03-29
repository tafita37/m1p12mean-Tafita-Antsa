import { Routes } from '@angular/router';
import { CRUDSousService } from '../../pages/manager/details/service/sous/crudSousService';
import { CRUDService } from '../../pages/manager/details/service/crudService';

export default [
    {
        path: 'crudService',
        component: CRUDService
    },
    {
        path: 'crudSousService',
        component: CRUDSousService
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
