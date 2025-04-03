import { Component, ElementRef } from '@angular/core';
import { AppMenuManager } from './app.menu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenuManager],
    templateUrl : "./app.sidebar.html"
})
export class AppSidebarManager {
    model: MenuItem[] = [];
    constructor(public el: ElementRef) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Accueil',
                items: [
                    {
                        label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/manager/dashboard']
                    },
                    {
                        label: 'Stock', icon: 'pi pi-box pi-wrench', routerLink: ['/manager/piece/stock']
                    },
                    {
                        label: 'Rendez-vous à valider',
                        icon: 'pi pi-calendar pi-wrench',
                        routerLink: ['/manager/rdv/nonValider']
                    },
                ]
            },
            {
                label: 'Mécanicien',
                items: [
                    {
                        label: 'Liste des mécaniciens',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/manager/mecanicien/list']
                    },
                ]
            },
            {
                label: 'Utilisateur',
                items: [
                    {
                        label: 'Inscription à valider',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/manager/user/userNotValider']
                    },
                    {
                        label: 'CRUD',
                        icon: 'pi pi-fw pi-database',
                        routerLink: ['/manager/user/crud']
                    }
                ]
            },
            {
                label: 'Données',
                items: [
                    {
                        label: 'Pièces', icon: 'pi pi-fw pi-wrench', items: [
                            {
                                label: 'Pièces',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['/manager/piece/crud']
                            },
                            {
                                label: 'Détails',
                                icon: 'pi pi-cog pi-wrench',
                                routerLink: ['/manager/piece/crudDetail']
                            }
                        ]
                    },
                    {
                        label: 'Marques', icon: 'pi pi-car pi-wrench', routerLink: ['/manager/marque/crud']
                    },
                    {
                        label: 'Fournisseur',
                        icon: 'pi pi-users pi-wrench',
                        routerLink: ['/manager/piece/crudFournisseur']
                    },
                    {
                        label: 'Services',
                        icon: 'pi pi-fw pi-cog',
                        items: [
                            {
                                label: 'Services',
                                icon: 'pi pi-fw pi-cog',
                                routerLink: ['/manager/service/crudService']
                            },
                            {
                                label: 'Sous-services',
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['/manager/service/crudSousService']
                            }
                        ]
                    },
                ]
            },
            // {
            //     label: 'UI Components',
            //     items: [
            //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            //         { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
            //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            //         { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
            //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
            //     ]
            // },
            // {
            //     label: 'Pages',
            //     icon: 'pi pi-fw pi-briefcase',
            //     routerLink: ['/pages'],
            //     items: [
            //         {
            //             label: 'Landing',
            //             icon: 'pi pi-fw pi-globe',
            //             routerLink: ['/landing']
            //         },
            //         {
            //             label: 'Auth',
            //             icon: 'pi pi-fw pi-user',
            //             items: [
            //                 {
            //                     label: 'Login',
            //                     icon: 'pi pi-fw pi-sign-in',
            //                     routerLink: ['/auth/login']
            //                 },
            //                 {
            //                     label: 'Error',
            //                     icon: 'pi pi-fw pi-times-circle',
            //                     routerLink: ['/auth/error']
            //                 },
            //                 {
            //                     label: 'Access Denied',
            //                     icon: 'pi pi-fw pi-lock',
            //                     routerLink: ['/auth/access']
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Crud',
            //             icon: 'pi pi-fw pi-pencil',
            //             routerLink: ['/pages/crud']
            //         },
            //         {
            //             label: 'Not Found',
            //             icon: 'pi pi-fw pi-exclamation-circle',
            //             routerLink: ['/pages/notfound']
            //         },
            //         {
            //             label: 'Empty',
            //             icon: 'pi pi-fw pi-circle-off',
            //             routerLink: ['/pages/empty']
            //         }
            //     ]
            // },
            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation',
            //             icon: 'pi pi-fw pi-book',
            //             routerLink: ['/documentation']
            //         },
            //         {
            //             label: 'View Source',
            //             icon: 'pi pi-fw pi-github',
            //             url: 'https://github.com/primefaces/sakai-ng',
            //             target: '_blank'
            //         }
            //     ]
            // }
        ];
    }
}
