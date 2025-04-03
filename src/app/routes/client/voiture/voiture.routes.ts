import { Routes } from '@angular/router';
import { CRUDVoiture } from '../../../pages/client/voiture/crud/crudVoiture';
import { ListVoitureAvancement } from '../../../pages/client/voiture/avancement/listVoitureAvancement';
import { DetailDemande } from '../../../pages/client/voiture/avancement/detail/detailAvancement';

export default [
    {
        path: 'crud',
        component: CRUDVoiture
    },
    {
        path: 'listVoiture',
        component: ListVoitureAvancement
    },
    {
        path: 'avancement/:idDemande',
        component: DetailDemande
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
