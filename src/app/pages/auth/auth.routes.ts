import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { LoginMecanicien } from './mecanicien/loginUserMecanicien';
import { SignUpClient } from './signup/signUpUserClient';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'loginMecanicien', component: LoginMecanicien },
    { path: 'signUpClient', component: SignUpClient }
] as Routes;
