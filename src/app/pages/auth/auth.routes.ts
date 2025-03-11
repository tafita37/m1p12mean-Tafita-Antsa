import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { LoginMecanicien } from './mecanicien/loginUserMecanicien';
import { SignUpClient } from './signup/signUpUserClient';
import { LoginManager } from './manager/loginManager';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'loginMecanicien', component: LoginMecanicien },
    { path: 'loginManager', component: LoginManager },
    { path: 'signUpClient', component: SignUpClient }
] as Routes;
