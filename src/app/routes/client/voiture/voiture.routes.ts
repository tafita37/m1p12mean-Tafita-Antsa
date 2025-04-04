import { Routes } from '@angular/router';
import { CRUDVoiture } from '../../../pages/client/voiture/crud/crudVoiture';
import { ListVoitureAvancement } from '../../../pages/client/voiture/avancement/listVoitureAvancement';
import { DetailDemande } from '../../../pages/client/voiture/avancement/detail/detailAvancement';
import { HistoriqueVoiture } from '../../../pages/client/voiture/crud/historique/historiqueVoiture';

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
    {
        path: 'historique/:idVoiture',
        component: HistoriqueVoiture
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
