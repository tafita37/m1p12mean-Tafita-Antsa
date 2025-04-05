import { Routes } from '@angular/router';
import { ListMecanicien } from '../../../pages/manager/rdv/performance/listMecanicien';
import { ListeTacheAValider } from '../../../pages/manager/rdv/performance/taches/listeTacheAValider';

export default [
    {
        path: 'list',
        component: ListMecanicien
    },
    {
        path: 'listTaches/:idMecanicien',
        component: ListeTacheAValider
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
