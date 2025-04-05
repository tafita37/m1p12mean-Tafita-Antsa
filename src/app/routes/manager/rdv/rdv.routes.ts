import { Routes } from '@angular/router';
import { RDVNv } from '../../../pages/manager/rdv/rdvNv';
import { ValidationRDV } from '../../../pages/manager/rdv/validation/validationRDV';

export default [
    {
        path: 'nonValider',
        component: RDVNv
    },
    {
        path: 'validation/:idDemande',
        component: ValidationRDV
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
