import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/manager/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AppLayoutManager } from './app/layout/component/manager/layout/app.layout';
import { authClientGuard, authManagerGuard, authMecanicienGuard } from './app/guards/authManager.guard';
import { AppLayoutClient } from './app/layout/component/client/layout/app.layout';
import { AppLayoutMecanicien } from './app/layout/component/mecanicien/layout/app.layout';

export const appRoutes: Routes = [
    {
        path: 'other',
        component: AppLayout,
        children: [
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    {
        path: "manager",
        component: AppLayoutManager,
        canActivate: [authManagerGuard],
        children: [
            { path: "dashboard", component: Dashboard },
            { path: "", loadChildren: () => import('./app/routes/manager/manager.routes') },
        ]
    },
    {
        path: "client",
        component: AppLayoutClient,
        canActivate: [authClientGuard],
        children: [
            { path: "", loadChildren: () => import('./app/routes/client/client.routes') },
        ]
    },
    {
        path: "mecanicien",
        component: AppLayoutMecanicien,
        canActivate: [authMecanicienGuard],
        children: [
            { path: "", loadChildren: () => import('./app/routes/mecanicien/mecanicien.routes') },
        ]
    },
    { path: "", component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
