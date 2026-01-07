import { Routes } from '@angular/router';
import { MainviewComponent } from './mainview/mainview.component';
import { SettingspageComponent } from './settingspage/settingspage.component';
import { ExportComponent } from './export/export.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'mainview',
        pathMatch: 'full'
    },
    {
        path: 'mainview',
        component: MainviewComponent,
    },
    {
        path: 'settings',
        component: SettingspageComponent,
    },
    {
        path: 'export',
        component: ExportComponent,
    }
];
