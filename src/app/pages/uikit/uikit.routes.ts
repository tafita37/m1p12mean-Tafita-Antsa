import { Routes } from '@angular/router';
import { ButtonDemo } from './button/buttondemo';
import { ChartDemo } from './chart/chartdemo';
import { FileDemo } from './form/file/filedemo';
import { FormLayoutDemo } from './form/layout/formlayoutdemo';
import { InputDemo } from './form/input/inputdemo';
import { ListDemo } from './list/listdemo';
import { MediaDemo } from './media/mediademo';
import { MessagesDemo } from './message/messagesdemo';
import { MiscDemo } from './misc/miscdemo';
import { PanelsDemo } from './panels/panelsdemo';
import { TimelineDemo } from './timeline/timelinedemo';
import { TableDemo } from './table/tabledemo';
import { OverlayDemo } from './overlay/overlaydemo';
import { TreeDemo } from './tree/treedemo';
import { MenuDemo } from './menu/menudemo';

export default [
    { path: 'button', data: { breadcrumb: 'Button' }, component: ButtonDemo },
    { path: 'charts', data: { breadcrumb: 'Charts' }, component: ChartDemo },
    { path: 'file', data: { breadcrumb: 'File' }, component: FileDemo },
    { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, component: FormLayoutDemo },
    { path: 'input', data: { breadcrumb: 'Input' }, component: InputDemo },
    { path: 'list', data: { breadcrumb: 'List' }, component: ListDemo },
    { path: 'media', data: { breadcrumb: 'Media' }, component: MediaDemo },
    { path: 'message', data: { breadcrumb: 'Message' }, component: MessagesDemo },
    { path: 'misc', data: { breadcrumb: 'Misc' }, component: MiscDemo },
    { path: 'panel', data: { breadcrumb: 'Panel' }, component: PanelsDemo },
    { path: 'timeline', data: { breadcrumb: 'Timeline' }, component: TimelineDemo },
    { path: 'table', data: { breadcrumb: 'Table' }, component: TableDemo },
    { path: 'overlay', data: { breadcrumb: 'Overlay' }, component: OverlayDemo },
    { path: 'tree', data: { breadcrumb: 'Tree' }, component: TreeDemo },
    { path: 'menu', data: { breadcrumb: 'Menu' }, component: MenuDemo },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
