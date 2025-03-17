import { Routes } from '@angular/router';
import { UserNotValider } from '../../pages/manager/validation/userNotValider';

export default [
    {
        path: 'userNotValider',
        component: UserNotValider
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
