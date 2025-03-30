import { Routes } from '@angular/router';
import { CRUDVoiture } from '../../pages/client/voiture/crud/crudVoiture';

export default [
    {
        path: 'crud',
        component: CRUDVoiture
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
