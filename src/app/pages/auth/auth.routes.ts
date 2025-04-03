import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { LoginMecanicien } from './mecanicien/loginUserMecanicien';
import { SignUpClient } from './signup/client/signUpUserClient';
import { LoginManager } from './manager/loginManager';
import { SignUpMecanicien } from './signup/mecanicien/signUpUserMecanicien';
import { LoginClient } from './client/loginUserClient';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'loginMecanicien', component: LoginMecanicien },
    { path: 'loginClient', component: LoginClient },
    { path: 'loginManager', component: LoginManager },
    { path: 'signUpClient', component: SignUpClient },
    { path: 'signUpMecanicien', component: SignUpMecanicien },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
