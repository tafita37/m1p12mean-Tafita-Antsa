import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/manager/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { LoginClient } from './app/pages/auth/client/loginUserClient';
import { AppLayoutManager } from './app/layout/component/manager/layout/app.layout';
import { authManagerGuard } from './app/guards/authManager.guard';
import { ReservationComponent } from './app/pages/client/reservation/reservation.component';
import { HistoryComponent } from './app/pages/client/history/history.component';
import { VehiculeComponent } from './app/pages/client/vehicule/vehicule.component';
import { AppointmentComponent } from './app/pages/manager/appointment/appointment.component';
import { PlanningComponent } from './app/pages/manager/planning/planning.component';

export const appRoutes: Routes = [
    {
        path: "",
        component: LoginClient
    },
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
        component: AppLayoutManager,
        children: [
            {path: "reservation", component: ReservationComponent},
            {path: "history", component: PlanningComponent},
            {path: "vehicule", component: VehiculeComponent},
            {path: "appointment", component: AppointmentComponent}
           
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
