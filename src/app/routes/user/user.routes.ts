import { Routes } from '@angular/router';
import { UserNotValider } from '../../pages/manager/user/validation/userNotValider';
import { CRUDUser } from '../../pages/manager/user/crud/crudUser';

export default [
    {
        path: 'userNotValider',
        component: UserNotValider
    },
    {
        path: 'crud',
        component: CRUDUser
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
